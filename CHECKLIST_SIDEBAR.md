# Checklist atomico: Sidebar con Accordion

## 1. Preparacion

- [ ] Confirmar que existe `src/components/ui/accordion.tsx`.
- [ ] Confirmar que `Accordion` exporta `Accordion`.
- [ ] Confirmar que `AccordionItem` esta exportado.
- [ ] Confirmar que `AccordionTrigger` esta exportado.
- [ ] Confirmar que `AccordionContent` esta exportado.
- [ ] Revisar el contrato de props de `Accordion`.
- [ ] Revisar el valor recomendado para `type`.
- [ ] Confirmar que `type="multiple"` permite varios grupos abiertos.
- [ ] Revisar si `AccordionContent` controla su propio overflow.
- [ ] Identificar todos los consumidores de `SidebarGroup`.
- [ ] Identificar todos los consumidores de `SidebarContent`.
- [ ] Confirmar que el cambio visual no afecta mail ni chat.

## 2. Modelo de navegacion

- [ ] Revisar la interfaz `NavGroup`.
- [ ] Confirmar que cada grupo tiene un `id` unico.
- [ ] Revisar cuales grupos tienen `label`.
- [ ] Revisar cuales grupos tienen `roles`.
- [ ] Revisar cuales items tienen `subItems`.
- [ ] Confirmar que los valores del Accordion seran strings.
- [ ] Definir el valor de cada item como `String(group.id)`.
- [ ] Evitar usar `group.label` como valor unico.
- [ ] Evitar usar `item.title` como valor unico.
- [ ] Confirmar que no existen IDs duplicados.

## 3. Filtrado por permisos

- [ ] Crear o reutilizar una funcion para filtrar grupos por `currentRole`.
- [ ] Mantener la validacion de `group.roles`.
- [ ] Crear o reutilizar una funcion para filtrar items por `currentRole`.
- [ ] Mantener la validacion de `item.roles`.
- [ ] Eliminar grupos que queden sin items visibles.
- [ ] Calcular los grupos abiertos despues de filtrar permisos.
- [ ] Confirmar que `Puestos de Trabajo` solo aparece para `SuperAdmin`.
- [ ] Confirmar que `Usuarios` solo aparece para `SuperAdmin`.
- [ ] Confirmar que `Roles` solo aparece para `SuperAdmin`.
- [ ] Confirmar que los roles operativos no reciben grupos vacios.

## 4. Deteccion de ruta activa

- [ ] Mantener el uso de `usePathname()`.
- [ ] Revisar la funcion actual `isItemActive`.
- [ ] Mantener la coincidencia por prefijo para subitems.
- [ ] Mantener la coincidencia exacta para items simples.
- [ ] Crear una funcion que determine si un grupo esta activo.
- [ ] Hacer que la funcion revise todos los items visibles del grupo.
- [ ] Hacer que la funcion revise los `subItems` visibles.
- [ ] Crear una lista de grupos activos.
- [ ] Convertir los IDs activos a strings.
- [ ] Usar la lista de grupos activos como `defaultValue`.
- [ ] Verificar una ruta del primer grupo.
- [ ] Verificar una ruta del segundo grupo.
- [ ] Verificar una ruta profunda de un subitem.

## 5. Integracion del Accordion

- [ ] Importar `Accordion` desde `@/components/ui/accordion`.
- [ ] Importar `AccordionItem` desde `@/components/ui/accordion`.
- [ ] Importar `AccordionTrigger` desde `@/components/ui/accordion`.
- [ ] Importar `AccordionContent` desde `@/components/ui/accordion`.
- [ ] Crear un `Accordion` alrededor de los grupos visibles.
- [ ] Configurar `type="multiple"`.
- [ ] Configurar `defaultValue` con los grupos activos.
- [ ] Asignar una key unica a cada `AccordionItem`.
- [ ] Asignar `value={String(group.id)}` a cada `AccordionItem`.
- [ ] Renderizar el label dentro de `AccordionTrigger`.
- [ ] Renderizar el menu dentro de `AccordionContent`.
- [ ] Mantener `SidebarGroupContent` dentro del contenido del Accordion.
- [ ] Mantener `SidebarMenu` dentro de `SidebarGroupContent`.
- [ ] Mantener el orden original de los grupos.
- [ ] Mantener el orden original de los items.

## 6. Estilos del trigger

- [ ] Revisar si `AccordionTrigger` hereda estilos compatibles con el sidebar.
- [ ] Aplicar ancho completo al trigger.
- [ ] Aplicar altura equivalente a los labels actuales.
- [ ] Aplicar padding horizontal consistente.
- [ ] Aplicar color `text-sidebar-foreground/70`.
- [ ] Aplicar estado hover compatible con el sidebar.
- [ ] Mantener foco visible.
- [ ] Mantener la flecha nativa del Accordion.
- [ ] Evitar renderizar una segunda flecha manual.
- [ ] Revisar la alineacion del texto y la flecha.
- [ ] Revisar el contraste del trigger en tema claro.
- [ ] Revisar el contraste del trigger en tema oscuro.

## 7. Contenido expandible

- [ ] Envolver cada menu de grupo con `AccordionContent`.
- [ ] Mantener la animacion de apertura existente.
- [ ] Confirmar que el contenido no se recorta.
- [ ] Confirmar que los items aparecen despues del trigger.
- [ ] Confirmar que los subitems mantienen su indentacion.
- [ ] Confirmar que los links siguen siendo clickeables.
- [ ] Confirmar que los estados activos siguen visibles.
- [ ] Evitar agregar `overflow-y-auto` al contenido.
- [ ] Evitar agregar una altura fija al contenido.

## 8. Items internos y subitems

- [ ] Mantener `SidebarMenuItem` para items simples.
- [ ] Mantener `SidebarMenuButton` para items simples.
- [ ] Mantener `Link` para navegacion.
- [ ] Mantener `prefetch={false}` donde ya exista.
- [ ] Mantener `target="_blank"` para items `newTab`.
- [ ] Mantener `comingSoon`.
- [ ] Mantener `isActive`.
- [ ] Mantener `Collapsible` para items internos con subitems, si siguen siendo necesarios.
- [ ] Confirmar que no se crean acordeones anidados accidentalmente.
- [ ] Mantener `SidebarMenuSub` para la indentacion de segundo nivel.
- [ ] Mantener los iconos de items y subitems.

## 9. Modo expandido

- [ ] Renderizar el Accordion en desktop expandido.
- [ ] Renderizar el Accordion en mobile.
- [ ] Confirmar que los labels son interactivos.
- [ ] Confirmar que varios grupos pueden permanecer abiertos.
- [ ] Confirmar que el grupo activo inicia abierto.
- [ ] Confirmar que cerrar un grupo no cambia la ruta.
- [ ] Confirmar que abrir un grupo no navega por si solo.
- [ ] Confirmar que hacer click en un item navega correctamente.

## 10. Modo colapsado

- [ ] Detectar `state === "collapsed"`.
- [ ] Mantener la condicion `!isMobile` para el modo desktop colapsado.
- [ ] Renderizar items simples como enlaces con icono.
- [ ] Renderizar items con subitems mediante `DropdownMenu`.
- [ ] No mostrar el Accordion expandido dentro del sidebar de iconos.
- [ ] Mantener `DropdownMenuTrigger`.
- [ ] Mantener `DropdownMenuContent`.
- [ ] Mantener la posicion lateral del dropdown.
- [ ] Mantener los links de subitems dentro del dropdown.
- [ ] Mantener los tooltips de los botones.
- [ ] Confirmar que los tooltips no aparecen innecesariamente en mobile.
- [ ] Confirmar navegacion de items simples en modo colapsado.
- [ ] Confirmar navegacion de subitems en dropdown.

## 11. Mobile

- [ ] Abrir el sidebar dentro del `Sheet`.
- [ ] Confirmar que el Accordion se renderiza en mobile.
- [ ] Confirmar que cada trigger tiene area tactil suficiente.
- [ ] Confirmar que el contenido expandido es visible.
- [ ] Confirmar que el Sheet no recorta la animacion.
- [ ] Confirmar que el scroll funciona con touch.
- [ ] Confirmar que cerrar el Sheet no rompe el estado del Accordion.
- [ ] Confirmar que los enlaces cierran o mantienen el comportamiento actual del Sheet.
- [ ] Verificar viewport movil pequeno.
- [ ] Verificar viewport movil grande.

## 12. Scroll del sidebar

- [ ] Revisar las clases actuales de `SidebarContent`.
- [ ] Mantener `min-h-0` en `SidebarContent`.
- [ ] Mantener `flex-1` en `SidebarContent`.
- [ ] Mantener `overflow-y-auto` en `SidebarContent`.
- [ ] Mantener `overflow-x-hidden` si es necesario.
- [ ] Eliminar `overflow-y-auto` de `SidebarGroup`.
- [ ] Eliminar el scrollbar personalizado de `SidebarGroup`.
- [ ] Mantener el scrollbar general en un unico contenedor.
- [ ] Confirmar que un grupo expandido crece naturalmente.
- [ ] Confirmar que los subitems no generan scroll interno.
- [ ] Confirmar que header y footer permanecen fijos.
- [ ] Confirmar scroll en sidebar desktop.
- [ ] Confirmar scroll en sidebar mobile.
- [ ] Confirmar scroll con todos los grupos abiertos.

## 13. Accesibilidad

- [ ] Confirmar que `AccordionTrigger` renderiza un button real.
- [ ] Confirmar que `aria-expanded` cambia correctamente.
- [ ] Confirmar que `aria-controls` apunta al contenido correcto.
- [ ] Confirmar que el foco es visible.
- [ ] Probar navegacion con `Tab`.
- [ ] Probar apertura con `Enter`.
- [ ] Probar apertura con `Space`.
- [ ] Probar cierre con `Enter`.
- [ ] Probar cierre con `Space`.
- [ ] Confirmar que los iconos decorativos no agregan texto innecesario.
- [ ] Confirmar que los enlaces tienen nombres accesibles.
- [ ] Confirmar que el tooltip no es la unica identificacion en mobile.
- [ ] Confirmar que `aria-disabled` conserva el comportamiento esperado.

## 14. Limpieza de codigo

- [ ] Eliminar imports que ya no se utilicen.
- [ ] Eliminar `SidebarGroupLabel` de `nav-main.tsx` si deja de utilizarse.
- [ ] Eliminar `ChevronRight` si ya no se usa en modo expandido.
- [ ] Mantener `ChevronRight` si sigue siendo necesario en modo colapsado.
- [ ] Eliminar variables derivadas que ya no sean necesarias.
- [ ] Separar funciones de filtrado si `NavMain` queda demasiado grande.
- [ ] Corregir el formato de `className` en `sidebar.tsx`.
- [ ] Eliminar espacios en blanco innecesarios.
- [ ] Mantener el estilo de comillas del archivo existente.
- [ ] Mantener el formato aplicado por Biome.

## 15. Verificacion automatica

- [ ] Ejecutar Biome sobre `sidebar.tsx`.
- [ ] Ejecutar Biome sobre `nav-main.tsx`.
- [ ] Corregir errores de lint.
- [ ] Ejecutar `npx tsc --noEmit`.
- [ ] Corregir errores de TypeScript.
- [ ] Ejecutar las pruebas existentes.
- [ ] Confirmar que las pruebas de permisos siguen pasando.
- [ ] Confirmar que no aparecen warnings de keys duplicadas.
- [ ] Confirmar que no aparecen warnings de accesibilidad.

## 16. Verificacion visual

- [ ] Abrir el dashboard con el sidebar expandido.
- [ ] Abrir todos los grupos.
- [ ] Cerrar todos los grupos.
- [ ] Cambiar entre grupos abiertos.
- [ ] Navegar a una ruta del primer grupo.
- [ ] Navegar a una ruta del segundo grupo.
- [ ] Recargar una ruta profunda.
- [ ] Confirmar apertura automatica del grupo activo.
- [ ] Comprobar el scrollbar general.
- [ ] Confirmar ausencia de scrollbar dentro de cada grupo.
- [ ] Probar el sidebar colapsado.
- [ ] Probar dropdowns del sidebar colapsado.
- [ ] Probar el Sheet mobile.
- [ ] Probar tema claro.
- [ ] Probar tema oscuro.
- [ ] Probar usuario `SuperAdmin`.
- [ ] Probar usuario operativo.

## 17. Criterio de finalizacion

- [ ] Todos los grupos visibles se renderizan como `AccordionItem`.
- [ ] Cada label funciona como `AccordionTrigger`.
- [ ] Cada menu de grupo esta dentro de `AccordionContent`.
- [ ] El grupo de la ruta activa inicia abierto.
- [ ] Los permisos existentes no cambiaron.
- [ ] El modo colapsado conserva sus dropdowns.
- [ ] Mobile conserva su navegacion.
- [ ] Existe un unico scroll vertical para el menu.
- [ ] Los subitems se muestran completos al abrir un grupo.
- [ ] No quedan errores de TypeScript.
- [ ] No quedan errores de Biome.
- [ ] Las pruebas pasan.
- [ ] La verificacion visual fue completada.
