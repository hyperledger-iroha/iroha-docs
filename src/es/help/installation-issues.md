---
translation_locale: es
translation_source: /help/installation-issues.md
translation_source_hash: 5dc09ae199ec2ec268dba53af9ebf43927a5e0254c5bb2e0fb908e0624b66661
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Soluciones de problemas de instalación {#troubleshooting-installation-issues}

Esta sección ofrece consejos de solución de problemas para la instalación de Iroha 3. Si el problema que está experimentando no se describe aquí, póngase en contacto con nosotros a través del [Telegram](https://t.me/hyperledgeriroha).

## Verificaciones rápidas {#quick-checks}

La mayoría de las fallas en la instalación provienen de uno de los cuatro lugares:

- una cadena de herramientas Rust mayor que la versión fijada por el espacio de trabajo ascendente.
- `cargo` o `rustc` que se resuelven en una instalación diferente a la de `rustup`
- las herramientas de construcción del sistema faltantes, como un compilador C, `pkg-config`, o CMake
- fragmentos generados obsoletos o artefactos de construcción local después de cambiar las revisiones de la fuente

A partir del pago de la fuente Iroha, comience con:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

Si `cargo metadata` falla, corrija la cadena de herramientas local antes de ejecutar `pnpm refresh:iroha --source /path/to/iroha`, porque la actualización puede invocar Kagami para generar el esquema actual del modelo de datos.

## Resolución de problemas Rust cadena de herramientas {#troubleshooting-rust-toolchain}

A veces, las cosas no van como se planeaba. Especialmente si usted tenía `rust` en su sistema hace un tiempo, pero no ha actualizado. Un problema similar puede ocurrir en Python: XKCD tiene un famoso ejemplo de lo que podría parecer:

<div class="flex justify-center">

![Python medio ambiente de resolución de problemas cómico](/img/install-troubles.png)

</div>

### Verificación de la versión Rust {#check-rust-version}

En el interés de preservar tanto su salud como la nuestra, asegúrese de que tenga la versión correcta de `cargo` emparejada con la versión adecuada de `rustc`. El espacio de trabajo upstream actual declara `rust-version = "1.92"` y pines el canal de cadena de herramientas en `rust-toolchain.toml`.

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

y luego

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

Si usted tiene versiones más altas, está bien. Si usted tiene las versiones más bajas, puede ejecutar el siguiente comando para actualizarlo:

```bash
$ rustup toolchain update stable
```

### Verifique la ubicación de la instalación {#check-installation-location}

Si obtienes números de versiones más bajos y actualizaste la cadena de herramientas y no funciona... digamos que es un problema común, pero no tiene una solución común.

En primer lugar, debe establecer dónde está instalada la versión que desea utilizar:

```bash
$ rustup which rustc
$ rustup which cargo
```

Las instalaciones de los usuarios de las cadenas de herramientas se encuentran generalmente en `~/.rustup/toolchains/stable-*/bin/`.

```bash
$ rustup toolchain update stable
```

y eso debería solucionar tus problemas.

### Compruebe la versión predeterminada Rust {#check-the-default-rust-version}

Otra opción es que tiene la cadena de herramientas `stable` actualizada, pero no está establecida como predeterminada. ejecutar:

```bash
$ rustup default stable
```

Esto puede suceder si instaló una versión `nightly`, o estableció una versión específica Rust, pero se olvidó de desinstalarla.

### Verifique si existen otras versiones Rust {#check-if-there-are-other-rust-versions}

Continuando con la solución de problemas en el agujero del conejo, podríamos tener alias shell:

```bash
$ type rustc
$ type cargo
```

Si estos apuntan a ubicaciones distintas de la que vio al ejecutar `rustup which *`, entonces tiene un problema. Tenga en cuenta que añadir alias como estos no es suficiente:

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

La lógica interna todavía puede romperse independientemente de cómo organices tus alias con cáscara.

La solución más simple sería eliminar las versiones que no se utilizan.

Sin embargo, es más fácil decirlo que hacerlo, ya que implica el seguimiento de todas las versiones de rustup instaladas y disponibles para usted. La versión del administrador de paquetes del sistema y la que se instaló en la ubicación estándar en su carpeta de inicio cuando ejecutó el comando al principio de este tutorial. Para la primera, consulte su manual de distribución (Linux) (`apt remove rust`).

```bash
$ rustup toolchain list
```

Y luego, para cada `<toolchain>` (sin los brackets de ángulo, por supuesto):

```bash
$ rustup remove <toolchain>
```

Después de eso, asegúrese de que

```bash
$ cargo --help
```

Resultará en un error de comando no encontrado, es decir, que no hay una cadena de herramientas Rust activa instalada.

```bash
$ rustup toolchain install stable
```

## Solución de problemas Python cadena de herramientas {#troubleshooting-python-toolchain}

Al instalar el paquete de ruedas Python usando pip durante la configuración del cliente [Python ](/es/guide/tutorials/python.md), es posible que encuentre un error como: "iroha_python-*.whl no es una rueda compatible en esta plataforma".

Este error significa que pip está desactualizado, por lo que es necesario actualizarlo. En primer lugar, se recomienda comprobar sus OS para actualizaciones y realizar una actualización del sistema.

Si esto no funciona, puedes intentar actualizar `pip` para tu directorio de usuarios.

`python -m pip install --upgrade pip`

Asegúrese de que `pip` está instalado en su directorio doméstico. Para hacerlo, ejecute `whereis pip` y compruebe si `/home/username/.local/bin/pip` se encuentra entre los caminos. Si no, actualice la variable `PATH` de su caparazón.

Si el problema persiste, por favor [Contacta con nosotros](/es/help/) y reportar los resultados.

```
python --version
python3 --version
pip --version
pip3 --version
```
