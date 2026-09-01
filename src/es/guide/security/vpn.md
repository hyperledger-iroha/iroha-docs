---
translation_locale: es
translation_source: /guide/security/vpn.md
translation_source_hash: 020591f0d7c5560dfb2e9f3f4537f429cbeba864c3eb022856d42addcf32e225
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Redes Privadas Virtuales {#virtual-private-networks}

Un <abbr title="Virtual Private Network">VPN</abbr> es un control de red que limita quién puede acceder a los servicios Iroha. Es más útil para implementaciones privadas y de consorcio donde los validadores, los backends de aplicaciones y los operadores deben comunicarse a través de direcciones privadas en lugar de rutas abiertas de Internet.

Un VPN no reemplaza las claves de pares de red Iroha, las claves de cuenta, los permisos, las reglas de firewall, la monitorización ni el almacenamiento seguro de claves. Trátalo como una capa en la límite de despliegue: el VPN reduce la accesibilidad de la red, mientras que la configuración y gobernanza de Iroha deciden qué pares de red y cuentas son confiables.

## Cuándo usar un VPN {#when-to-use-a-vpn}

Usa un VPN cuando:

- los validadores son operados por diferentes organizaciones o en diferentes entornos de alojamiento
- Torii solo debería ser accesible por los backends de la aplicación, los operadores o los clientes de confianza
- las métricas, registros, SSH u otros puntos finales de administración API deben permanecer en una red privada del operador
- Una red de prueba o de preparación debería parecerse a los controles de acceso de producción sin exponer los puntos de acceso públicos API

No se requiere un VPN para cada implementación. Las redes públicas pueden exponer intencionalmente Torii a través de un gateway público, balanceador de carga o proxy inverso. Incluso en ese caso, mantenga el tráfico entre pares del validador y los endpoints de administración API en una red restringida siempre que sea posible.

::: tip

Un navegador VPN solo protege el tráfico de ese navegador. No protege `iroha3d`, CLI, SDK, SSH, métricas o tráfico de respaldo a menos que esos procesos se enruten a través de la misma red privada.

:::

## Patrón de Implementación {#deployment-pattern}

Para una red privada de validadores, asigne a cada validador una dirección estable VPN o un nombre privado DNS. Configure los pares de la red para que sus direcciones de pares publicitadas sean accesibles desde los otros validadores a través de esa red:

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

Utilice la dirección asignada al par de red actual en `network.address` y `network.public_address`. Cada par de red debe listar las mismas identidades de pares de red de confianza, pero con direcciones que sean accesibles desde su propia tabla de rutas VPN.

Las configuraciones del cliente y de CLI deberían apuntar a un endpoint API de Torii accesible a través de VPN o mediante una gateway interna controlada:

```toml
torii_url = "http://10.20.0.11:8080"
```

Si Torii debe estar disponible fuera de VPN, colóquelo detrás de un proxy inverso o balanceador de carga que proporcione TLS, autenticación, limitación de velocidad y registro. Evite exponer puertos peer-to-peer sin procesar o puntos finales de administración API directamente a Internet público.

## Reglas de firewall {#firewall-rules}

Use reglas de firewall del host y de la nube incluso cuando haya un VPN presente:

|Servicio|Acceso recomendado|
| --- | --- |
|Puerto de igual a igual| Otros validadores VPN solo abordan |
| Torii |Backends de aplicaciones, operadores o clientes confiables VPN rangos|
|Métricas y controles de salud|Sistemas de monitoreo en la red del operador|
| SSH y administración |Host bastión, operador privilegiado VPN rango, o proceso de romper-cristal|
|Copias de seguridad y replicación de almacenamiento|Sistemas de respaldo en una red privada|

Las reglas de denegación por defecto son más fáciles de auditar que las reglas de permiso amplias. Cuando un nuevo par de red se une a la red, actualice la membresía VPN, la lista de permitidos del firewall y la configuración de par de red confiable Iroha como un cambio coordinado.

## Lista de verificación operativa {#operational-checklist}

- Elija una implementación de VPN auditada y activamente mantenida, como WireGuard, IPsec o una red privada gestionada aprobada por la organización.
- Utilice credenciales únicas VPN para cada host y operador. No comparta claves VPN entre validadores.
- Mantenga las credenciales VPN separadas de las claves privadas Iroha y del material de firma del génesis de la blockchain.
- Monitoree la latencia VPN, pérdida de paquetes, reconexiones y cambios de ruta. El consenso es sensible a la inestabilidad sostenida de la red.
- Prueba la efectividad de MTU. La fragmentación de paquetes puede parecer fallos intermitentes del par de red o Torii.
- Documento que especifica qué rangos VPN pueden alcanzar los endpoints de igual a igual, Torii, métricas, SSH, y respaldo API.
- Gira las credenciales VPN cuando un host, una cuenta de operador o una organización abandona la red.
- Evite un solo VPN como la única ruta entre validadores. Planifique gateways redundantes o rutas de sitio a sitio para redes de producción.
- Incluya fallas VPN en los ejercicios de respuesta a incidentes para que los operadores sepan cuándo distinguir una partición de red de una falla de proceso Iroha.

## Páginas relacionadas {#related-pages}

- [Principios de seguridad](/es/guide/security/security-principles.md)
- [Seguridad Operativa](/es/guide/security/operational-security.md)
- [Claves para el Despliegue de la Red](/es/guide/configure/keys-for-network-deployment.md)
- [Gestión de pares de red](/es/guide/configure/peer-management.md)
- [Referencia de configuración de nodo de red](/es/reference/peer-config/index.md)
