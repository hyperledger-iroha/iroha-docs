---
translation_locale: es
translation_source: /guide/security/vpn.md
translation_source_hash: 4161cec5d601ad3a57decc19402738358a03648adad8502b5282e8e9bacc3fa8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Las redes privadas virtuales {#virtual-private-networks}

Un <abbr title="Virtual Private Network">VPN</abbr> es un control de red que limita quién puede acceder a los servicios Iroha. Es más útil para implementaciones privadas y de consorcio en las que los validadores, backends de aplicaciones y operadores deben comunicarse a través de direcciones privadas en lugar de rutas de Internet abiertas.

Un VPN no reemplaza las claves de pares, llaves de cuenta, permisos, reglas del firewall, monitoreo o almacenamiento seguro de la clave Iroha. el VPN restringe la accesibilidad de la red, mientras que la configuración y gobernanza del Iroha deciden en qué pares y cuentas se confía.

## Cuándo utilizar un VPN {#when-to-use-a-vpn}

Se utilizará un VPN cuando:

- Los validadores son operados por diferentes organizaciones o en diferentes entornos de alojamiento.
- Torii sólo debe ser accesible a través de backend de aplicaciones, operadores o clientes de confianza.
- Las métricas, registros, SSH u otros puntos finales de administración deben permanecer en una red de operadores privados.
- Una red de ensayo o fase debe parecerse a los controles de acceso de producción sin exponer puntos finales públicos.

No se requiere un VPN para cada implementación. Las redes públicas pueden exponer intencionalmente a Torii a través de una puerta de entrada pública, balanceador de carga o proxy inverso. Incluso en ese caso, mantenga el tráfico y los puntos finales de administración del validador entre pares en una red restringida siempre que sea posible.

::: tip

Un navegador VPN solo protege el tráfico de ese navegador. No protege a `irohad`, CLI, SDK, SSH, métricas o tráfico de copia de seguridad a menos que esos procesos se enruten a través de la misma red privada.

:::

## El patrón de despliegue {#deployment-pattern}

Para una red de validadores privados, dar a cada validador una dirección estable VPN o un nombre privado DNS. Configurar pares para que sus direcciones publicitadas entre pares puedan ser alcanzadas por los demás validadores a través de esa red:

```toml
trusted_peers = [
  "PUBLIC_KEY_1@10.20.0.11:1337",
  "PUBLIC_KEY_2@10.20.0.12:1337",
  "PUBLIC_KEY_3@10.20.0.13:1337",
  "PUBLIC_KEY_4@10.20.0.14:1337",
]

[network]
address = "10.20.0.11:1337"
public_address = "10.20.0.11:1337"

[torii]
address = "10.20.0.11:8080"
```

Utilice la dirección asignada al igual actual en `network.address` y `network.public_address`. Cada igual debe enumerar las mismas identidades de pares confiables, pero con direcciones accesibles desde su propia tabla de rutas VPN.

Las configuraciones del cliente y CLI deben apuntar a un punto final de Torii accesible a través del VPN o a través de una puerta de entrada interna controlada:

```toml
torii_url = "http://10.20.0.11:8080"
```

Si el Torii debe estar disponible fuera del VPN, colocalo detrás de un proxy inverso o balanceador de carga que proporcione TLS, autenticación, limitación de tarifas y registro. Evite exponer los puertos o puntos finales de administración peer-to-peer en bruto directamente a Internet público.

## Reglas del cortafuegos {#firewall-rules}

Utilice las reglas de firewall del host y la nube incluso cuando esté presente una VPN:

|Servicio |Acceso recomendado |
| --- | --- |
|Puerto de igual a igual|Las direcciones de otro validador VPN sólo |
|Torii |Rango de backends de aplicaciones, operadores o clientes de confianza VPN |
|Métricas y controles de salud |Sistemas de seguimiento en la red del operador |
|SSH y la administración |Anfitrión de bastión, operador privilegiado VPN gama o proceso de ruptura de vidrio |
|Las copias de seguridad y replicación del almacenamiento |Los sistemas de respaldo en una red privada |

Las reglas de negación por defecto son más fáciles de auditar que las reglas de admisión amplias. Cuando un nuevo peer se une a la red, actualice la membresía VPN, la lista de admisiones del firewall y la configuración de pares de confianza Iroha como un cambio coordinado.

## Lista de control operativo {#operational-checklist}

- Seleccione una implementación VPN auditada y mantenida activamente, como WireGuard, IPsec o una red privada gestionada aprobada por la organización.
- Utilice credenciales únicas VPN para cada servidor y operador. No comparta las claves VPN entre los validadores.
- Mantenga las credenciales VPN separadas de las claves privadas Iroha y del material para firmar la genesis.
- Monitorear VPN latencia, pérdida de paquetes, reconectas y cambios de ruta. El consenso es sensible a la inestabilidad de la red sostenida.
- Prueba la eficacia MTU. La fragmentación de paquetes puede parecerse a fallos intermitentes entre pares o Torii.
- Documento en el que los rangos VPN se permiten alcanzar entre pares, Torii, métricas, SSH y puntos finales de respaldo.
- Rotar las credenciales VPN cuando un host, cuenta del operador o organización abandone la red.
- Evitar una única puerta de enlace VPN como la única ruta entre validadores. Planificar puertas de enlace redundantes o rutas de sitio a sitio para redes de producción.
- Incluya fallas VPN en los simulacros de respuesta a incidentes para que los operadores sepan cuándo distinguir una partición de red de una falla del proceso Iroha.

## Páginas relacionadas {#related-pages}

- [Principios de seguridad](/es/guide/security/security-principles.md)
- [Seguridad operativa ](/es/guide/security/operational-security.md)
- [Las claves para la implementación de la red ](/es/guide/configure/keys-for-network-deployment.md)
- [Gestión entre pares ](/es/guide/configure/peer-management.md)
- [Referencia para la configuración entre pares ](/es/reference/peer-config/index.md)
