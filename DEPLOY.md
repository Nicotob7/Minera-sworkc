# Deploy de la web pública `sworkc.cl` — runbook

Reemplaza a `DEPLOY-AMPLIFY.md`, que describía un despliegue por AWS Amplify que **nunca
ocurrió**: el sitio se publicó como export estático a S3 + CloudFront. Aquel doc era el único
`.md` de la raíz que **nunca se commiteó** (`DESIGN.md` y `PRODUCT.md` sí lo están), así que
nada obligaba a actualizarlo cuando la realidad cambió. Este vive en el repo a propósito.

Todo lo de acá está verificado contra la cuenta 787309524404 (perfil `sworkc`) el
**2026-09-09**, ejecutando cada comando salvo el que se marca como no ejecutado.

---

## ⛔ Antes de tocar nada en AWS

- La distribución CloudFront **E3CBZSCE252COL** (`d173ega4r5epuy.cloudfront.net`) y el bucket
  **`s3://sworkc-apex`** **SON el sitio público en producción**.
- El campo *Comment* de esa distribución dice **"Sworkc apex placeholder"**. **Es mentira**:
  quedó sin actualizar desde antes del despliegue. No la borres ni la "reemplaces" por eso.
- Route 53, zona `Z0845249K9AAE4H8LR4P`: el registro **A del apex** es el alias a esa
  distribución. Los registros **`MX` son de Google Workspace → NO TOCAR** (se cae el correo
  corporativo `@sworkc.cl`).

Comprobar en cualquier momento quién sirve el apex:

```bash
aws route53 list-resource-record-sets --hosted-zone-id Z0845249K9AAE4H8LR4P --profile sworkc --query "ResourceRecordSets[?Type=='A'].[Name,AliasTarget.DNSName]" --output text
aws cloudfront list-distributions --profile sworkc --query "DistributionList.Items[?Id=='E3CBZSCE252COL'].[DomainName,Comment,Aliases.Items]" --output text
```

## Qué hay realmente en producción

Landing Next.js **exportada como sitio estático** (`output: "export"` en `swc/next.config.ts`)
→ `s3://sworkc-apex` → CloudFront con OAC (origen REST `sworkc-apex.s3.sa-east-1.amazonaws.com`,
`DefaultRootObject = index.html`). **No hay Amplify, no hay SSR, no hay servidor corriendo
para servir las páginas.**

El formulario de contacto **sí llama a un backend**: hace `POST` a
`https://api.sworkc.cl/api/v1/contacto` (`swc/components/sections/Contacto.tsx:143`, con
`NEXT_PUBLIC_API_URL` como override y esa URL por defecto). El `mailto:contacto@sworkc.cl`
que aparece en la tarjeta de contacto es sólo un enlace, no el envío. Importa para
diagnosticar: **si el formulario deja de andar, el problema no está en S3 ni en CloudFront**,
sino en `api.sworkc.cl`, en el endpoint `/api/v1/contacto` o en el CORS del origen apex.

```bash
# El backend tiene que aceptar el origen del sitio público:
curl -sI -X OPTIONS https://api.sworkc.cl/api/v1/contacto \
  -H 'Origin: https://sworkc.cl' -H 'Access-Control-Request-Method: POST' \
  | grep -i access-control-allow-origin
# esperado: access-control-allow-origin: https://sworkc.cl
```

## Antes de desplegar: verificá en qué checkout estás

El `swc/next.config.ts` de `main` **no** tiene `output: "export"` (y conserva la API route SSR
`swc/app/api/contact/`). El export estático entró en el commit `938ce5e`, que vive en
`feat/sitio-multipagina` — **ya pusheada a `origin`** (verificado 2026-09-09), igual que las
páginas que el sitio sirve hoy (`/producto/`, `/nosotros/`, `/novedades/`, `/recursos/`).
Desplegar desde `main` sube un sitio distinto del que está en producción.

```bash
grep -n 'output' swc/next.config.ts   # tiene que aparecer  output: "export"
```

Si no aparece, estás en el checkout equivocado: `npm run build` termina bien pero genera
`.next/` (SSR) en vez de `out/`, así que el paso 2 no tiene qué subir. **El build verde no
confirma que estés en la rama correcta**; lo único que lo confirma es el `grep` de arriba.

## Desplegar

### 1. Build

```bash
cd swc
npm ci
npm run build     # el export queda en swc/out/
```

### 2. Subir al bucket — **el dryrun es obligatorio**

```bash
aws s3 sync out/ s3://sworkc-apex/ --delete --dryrun --profile sworkc
```

Leé las líneas `delete:`. Lo único que debe borrar son artefactos viejos de `_next/static/`
(chunks y manifests con hash de builds anteriores). **Si aparece un `delete:` fuera de
`_next/static/`** —algo de `hero/`, `img/`, o una página entera— **pará**: estás subiendo un
build incompleto o de otra rama, y `--delete` te va a vaciar el sitio.

Referencia del dryrun del 2026-09-09: 18 deletes, todos `_next/static/`; 83 uploads.

Cuando el dryrun sea el esperado, el mismo comando sin `--dryrun`:

```bash
aws s3 sync out/ s3://sworkc-apex/ --delete --profile sworkc
```

`--delete` es necesario: sin él quedan chunks viejos en el bucket y CloudFront termina
sirviendo mezclas de dos builds.

### 3. Invalidar la cache de CloudFront

```bash
aws cloudfront create-invalidation --distribution-id E3CBZSCE252COL --paths "/*" --profile sworkc
```

> Único comando de este runbook **no ejecutado** al escribirlo (crea un recurso en producción).
> Su sintaxis sí está validada contra el CLI instalado, y hay invalidaciones previas con este
> patrón: `aws cloudfront list-invalidations --distribution-id E3CBZSCE252COL --profile sworkc`.

### 4. Verificar

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://sworkc.cl/
curl -s https://sworkc.cl/ | grep -o "<title>[^<]*</title>"
```

Esperado: `200` y `<title>Sworkc Technologies — Continuidad operacional minera</title>`.

## Rollback

No hay versionado en el bucket, así que el rollback es **volver a desplegar el build anterior**:
checkout del commit previo → pasos 1 a 4. Por eso importa que el código esté pusheado.

## Amplify: evaluado y descartado

Se evaluó AWS Amplify Hosting (plataforma `WEB_COMPUTE`) para servir la landing con SSR y un
formulario de contacto por SES. **Se descartó**: exigía crear IAM (rol de cómputo + usuario
SMTP) y se resolvió por la vía estática, que no necesita IAM. Hoy **no existe ninguna app
Amplify** (`aws amplify list-apps` devuelve `[]` en sa-east-1, us-east-1 y us-west-2).
Si alguna vez se retoma, hay que rehacer el procedimiento desde cero: los comandos del runbook
viejo estaban además incompletos (a `create-branch` y `start-job` les faltaba `--app-id`, y a
`create-domain-association` `--app-id` y `--sub-domain-settings`).

## Pendientes conocidos

- **GitHub PAT del dueño**: durante el scoping de Amplify se recibió un PAT personal. No se usó
  y no quedó en ningún recurso AWS, pero **no está confirmada su revocación**. Revocarlo en
  GitHub → Settings → Developer settings → Personal access tokens.
- El *Comment* de E3CBZSCE252COL sigue diciendo "placeholder". Corregirlo es un
  `update-distribution` sobre producción: pendiente de decisión, no lo hagas al pasar.
- `https://sworkc.cl/<ruta-inexistente>` devuelve el 403 XML de S3/CloudFront, no el `404.html`
  del sitio: la distribución no tiene *Custom Error Responses* configuradas.
