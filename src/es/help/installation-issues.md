---
translation_locale: es
translation_source: /help/installation-issues.md
translation_source_hash: 1a2519123edc5224e720e23ef3e2bc2a7b4dba38ef87af49216c31c054c85a2a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Solución de problemas de instalación {#troubleshooting-installation-issues}

Esta sección ofrece consejos para la solución de problemas de la instalación de Iroha 3. Si el problema que está experimentando no se describe aquí, contáctenos a través de [Telegram](https://t.me/hyperledgeriroha).

## Revisiones rápidas {#quick-checks}

La mayoría de los fallos de instalación provienen de uno de cuatro lugares:

- un conjunto de herramientas Rust más antiguo que la versión fijada por el espacio de trabajo ascendente
- `cargo` o `rustc` resolviendo a una instalación diferente de `rustup`
- faltan herramientas de compilación del sistema como un compilador de C, `pkg-config`, o CMake
- fragmentos generados obsoletos o artefactos de compilación locales después de cambiar revisiones de origen

Desde la copia de trabajo del código fuente Iroha, comience con:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

Si `cargo metadata` falla, arregla la cadena de herramientas local antes de ejecutar `pnpm refresh:iroha --source /path/to/iroha`, porque la actualización puede invocar Kagami para generar el esquema del modelo de datos actual.

## Solución de problemas Rust Cadena de herramientas {#troubleshooting-rust-toolchain}

A veces, las cosas no salen según lo planeado. Especialmente si tuviste `rust` en tu sistema hace un tiempo, pero no actualizaste. Un problema similar puede ocurrir en Python: XKCD tiene un ejemplo famoso de cómo podría verse eso:

<div class="flex justify-center">

![Python cómic de solución de problemas del entorno](/img/install-troubles.png)

</div>

### Verificar la versión Rust {#check-rust-version}

En aras de preservar tanto tu cordura como la nuestra, asegúrate de tener la versión correcta de `cargo` emparejada con la versión correcta de `rustc`. El espacio de trabajo ascendente actual declara `rust-version = "1.92"` y bloquea el canal de la cadena de herramientas en `rust-toolchain.toml`. Para mostrar las versiones, haz

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

y luego

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

Si tienes versiones más altas, estás bien. Si tienes versiones más bajas, puedes ejecutar el siguiente comando para actualizarlo:

```bash
$ rustup toolchain update stable
```

### Verificar ubicación de la instalación {#check-installation-location}

Si obtienes números de versión más bajos y actualizaste la cadena de herramientas y no funcionó… digamos que es un problema común, pero no tiene una solución común.

En primer lugar, debe establecer dónde está instalada la versión que desea usar:

```bash
$ rustup which rustc
$ rustup which cargo
```

Las instalaciones de los toolchains por parte del usuario suelen estar en `~/.rustup/toolchains/stable-*/bin/`. Si ese es el caso, deberías poder ejecutar

```bash
$ rustup toolchain update stable
```

y eso debería solucionar tus problemas.

### Verifique la versión predeterminada Rust {#check-the-default-rust-version}

Otra opción es que tengas el conjunto de herramientas `stable` actualizado, pero no esté configurado como predeterminado. Ejecuta:

```bash
$ rustup default stable
```

Instalar una versión de `nightly` o configurar una versión específica de Rust sin luego desactivarla puede causar este problema.

### Verifica si hay otras versiones Rust {#check-if-there-are-other-rust-versions}

Continuando por el agujero de conejo de la solución de problemas, podríamos tener alias de shell:

```bash
$ type rustc
$ type cargo
```

Si estos apuntan a ubicaciones distintas de la que viste al ejecutar `rustup which *`, entonces tienes un problema. Ten en cuenta que agregar alias como estos no es suficiente:

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

La lógica interna aún puede fallar independientemente de cómo organices tus alias de shell.

La solución más simple sería eliminar las versiones que no usas.

Sin embargo, es más fácil decirlo que hacerlo, ya que implica rastrear todas las versiones de rustup instaladas y disponibles para usted. Por lo general, solo hay dos: la versión del gestor de paquetes del sistema y la que se instaló en la ubicación estándar en tu carpeta de inicio cuando ejecutaste el comando al principio de este tutorial. Para la primera, consulta el manual de tu distribución (Linux), (`apt remove rust`). Para la segunda, ejecuta:

```bash
$ rustup toolchain list
```

Y luego, para cada `<toolchain>` (sin los corchetes angulares, por supuesto):

```bash
$ rustup remove <toolchain>
```

Después de eliminar las cadenas de herramientas, este comando debería informar un error de comando no encontrado:

```bash
$ cargo --help
```

Ese error confirma que no queda instalado ningún conjunto de herramientas Rust activo. Luego ejecute:

```bash
$ rustup toolchain install stable
```

## Solución de problemas de la cadena de herramientas Python {#troubleshooting-python-toolchain}

Cuando instala el paquete Python Wheel usando pip durante [Python configuración del cliente](/es/guide/tutorials/python.md), puede encontrarse con un error como: "iroha_python-*.whl no es una rueda compatible en esta plataforma".

Este error significa que pip está desactualizado, por lo que necesitas actualizarlo. Antes que nada, se recomienda verificar tus OS para actualizaciones y realizar una actualización del sistema.

Si esto no funciona, puedes intentar actualizar `pip` para tu directorio de usuario.

`python -m pip install --upgrade pip`

Asegúrese de que `pip` esté instalado en su directorio de inicio. Para hacer esto, ejecute `whereis pip` y verifique si `/home/username/.local/bin/pip` está entre las rutas. Si no, actualice la variable `PATH` de su shell.

Si el problema persiste, por favor [contáctanos](/es/help/) y reporte los resultados.

```
python --version
python3 --version
pip --version
pip3 --version
```
