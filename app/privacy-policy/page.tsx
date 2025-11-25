import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad - FINANCE',
  description: 'Política de privacidad y tratamiento de datos personales de FINANCE',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Política de Privacidad
        </h1>
        
        <p className="text-sm text-gray-600 mb-8">
          Última actualización: 24 de noviembre de 2025
        </p>

        <div className="space-y-8 text-gray-700">
          {/* Aviso importante */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  ⚠️ AVISO IMPORTANTE: APLICACIÓN DE DEMOSTRACIÓN
                </h3>
                <p className="text-yellow-700 mb-2">
                  <strong>FINANCE es una aplicación de simulación y demostración con fines educativos 
                  y de prueba.</strong> No es una institución financiera real ni está autorizada para 
                  operar como tal.
                </p>
                <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                  <li>No se procesan transacciones financieras reales</li>
                  <li>Los pagos con Stripe están en modo de prueba (test mode)</li>
                  <li>No se otorgan créditos ni préstamos reales</li>
                  <li>Esta aplicación es solo para propósitos demostrativos</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Introducción */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Introducción
            </h2>
            <p className="mb-4">
              En FINANCE, nos comprometemos a proteger su privacidad y garantizar la seguridad 
              de sus datos personales. Esta Política de Privacidad describe cómo recopilamos, 
              usamos, almacenamos y protegemos su información cuando utiliza nuestra aplicación 
              móvil y plataforma web de simulación de servicios microfinancieros.
            </p>
            <p className="mb-4">
              <strong className="text-red-600">IMPORTANTE:</strong> Esta es una aplicación de 
              demostración. Aunque implementamos medidas de seguridad para proteger sus datos, 
              le recomendamos <strong>NO ingresar información personal real, financiera o sensible</strong>.
            </p>
            <p>
              Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política 
              y reconoce que esta es una plataforma de simulación.
            </p>
          </section>

          {/* Información que recopilamos */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Información que Recopilamos
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-semibold mb-2">
                ⚠️ RECOMENDACIÓN IMPORTANTE
              </p>
              <p className="text-red-700 text-sm">
                Como esta es una aplicación de demostración, le recomendamos encarecidamente 
                <strong> NO ingresar datos personales reales</strong>. Use información ficticia 
                o de prueba para explorar las funcionalidades.
              </p>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
              2.1 Información Personal
            </h3>
            <p className="mb-2">La plataforma solicita la siguiente información personal cuando se registra:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Nombre completo</li>
              <li>Número de identificación (DNI, cédula, pasaporte)</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Dirección física</li>
              <li>Fecha de nacimiento</li>
              <li>Información laboral y de ingresos</li>
              <li>Fotografía de perfil (opcional)</li>
            </ul>
            <p className="text-sm text-orange-600 italic">
              Nota: Para propósitos de demostración, puede usar datos ficticios.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
              2.2 Información Financiera (Simulada)
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Historial de solicitudes de crédito simuladas</li>
              <li>Información de cuentas y tarjetas registradas (datos de prueba)</li>
              <li>Historial de transacciones y pagos simulados</li>
              <li>Información de scoring crediticio (calculado con datos de prueba)</li>
              <li>Datos de pagos procesados a través de Stripe en modo prueba</li>
            </ul>
            <p className="text-sm text-orange-600 italic">
              Nota: Toda la información financiera es simulada y no representa obligaciones reales.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
              2.3 Información Técnica y de Uso
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Dirección IP</li>
              <li>Tipo de dispositivo y sistema operativo</li>
              <li>Identificador único del dispositivo</li>
              <li>Información de navegación y uso de la aplicación</li>
              <li>Registros de actividad (logs)</li>
              <li>Cookies y tecnologías similares</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
              2.4 Información de Ubicación
            </h3>
            <p className="mb-4">
              Con su consentimiento, recopilamos información de ubicación geográfica para:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Verificar su identidad y prevenir fraudes</li>
              <li>Mostrar sucursales o puntos de servicio cercanos</li>
              <li>Cumplir con requisitos regulatorios</li>
            </ul>
          </section>

          {/* Permisos de la aplicación móvil */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Permisos de la Aplicación Móvil
            </h2>
            <p className="mb-4">
              Nuestra aplicación móvil solicita los siguientes permisos en su dispositivo:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800">Internet y Red</h4>
                <p className="text-sm">
                  Necesario para conectarse a nuestros servidores y acceder a los servicios financieros.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800">Cámara</h4>
                <p className="text-sm">
                  Utilizado para capturar documentos de identificación, comprobantes de pago y 
                  fotografías de perfil. Solo se activa cuando usted lo solicita.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800">Almacenamiento (Lectura de Imágenes)</h4>
                <p className="text-sm">
                  Permite seleccionar imágenes de su galería para cargar documentos o fotografías.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800">Ubicación (GPS)</h4>
                <p className="text-sm">
                  Utilizado para verificación de identidad, prevención de fraudes y mostrar 
                  servicios cercanos. Puede denegar este permiso, pero algunas funciones pueden 
                  estar limitadas.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800">Autenticación Biométrica (Huella Digital)</h4>
                <p className="text-sm">
                  Permite iniciar sesión de forma segura usando su huella digital o reconocimiento 
                  facial. Es completamente opcional.
                </p>
              </div>
            </div>
          </section>

          {/* Cómo usamos su información */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Cómo Usamos su Información
            </h2>
            <p className="mb-4">
              En esta aplicación de demostración, utilizamos la información recopilada para 
              simular las siguientes funcionalidades:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Simular el procesamiento de solicitudes de crédito y gestión de cuentas</li>
              <li>Demostrar sistemas de verificación de identidad</li>
              <li>Mostrar cómo funciona un sistema de scoring crediticio</li>
              <li>Simular procesamiento de pagos y transacciones (sin dinero real)</li>
              <li>Enviar notificaciones de prueba sobre estados de solicitudes</li>
              <li>Demostrar funcionalidades de comunicación con usuarios</li>
              <li>Mejorar y personalizar la experiencia de demostración</li>
              <li>Realizar pruebas y análisis de la plataforma</li>
              <li>Demostrar sistemas de detección de fraudes</li>
            </ul>
            <p className="text-sm text-blue-600 italic">
              Recordatorio: Esta es una aplicación de demostración. No se toman decisiones 
              financieras reales ni se procesan transacciones con dinero real.
            </p>
          </section>

          {/* Procesamiento de pagos */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Procesamiento de Pagos con Stripe (MODO PRUEBA)
            </h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 font-semibold mb-2">
                🧪 MODO DE PRUEBA - NO SE PROCESAN PAGOS REALES
              </p>
              <p className="text-blue-700 text-sm">
                Todos los pagos en esta aplicación utilizan el modo de prueba de Stripe. 
                No se realizan cargos reales a tarjetas de crédito o débito.
              </p>
            </div>

            <p className="mb-4">
              Utilizamos <strong>Stripe</strong> como procesador de pagos para demostrar la 
              funcionalidad de transacciones con tarjetas de crédito y débito. Esta funcionalidad 
              está en <strong className="text-orange-600">modo de prueba (test mode)</strong> y{' '}
              <strong className="text-red-600">NO procesa pagos reales</strong>.
            </p>
            <p className="mb-4">
              Cuando realiza un "pago" de prueba a través de Stripe:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Solo se aceptan tarjetas de prueba de Stripe (ej: 4242 4242 4242 4242)</li>
              <li>No se realizan cargos reales a ninguna tarjeta</li>
              <li>Los datos de tarjeta son procesados por Stripe en modo sandbox</li>
              <li>No almacenamos información completa de tarjetas en nuestros servidores</li>
              <li>Solo recibimos un identificador de transacción simulada</li>
            </ul>
            <p className="text-sm text-gray-600 mb-4">
              Para más información sobre cómo Stripe maneja sus datos, consulte la{' '}
              <a 
                href="https://stripe.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Política de Privacidad de Stripe
              </a>.
            </p>
            <p className="text-sm text-red-600 font-semibold">
              ⚠️ Recomendación: Use solo tarjetas de prueba de Stripe. Nunca ingrese información 
              real de tarjetas de crédito o débito en esta aplicación de demostración.
            </p>
          </section>

          {/* Compartir información */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Compartir su Información
            </h2>
            <p className="mb-4">
              No vendemos ni alquilamos su información personal a terceros. Podemos compartir 
              su información únicamente en las siguientes circunstancias:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Proveedores de servicios:</strong> Firebase (almacenamiento y autenticación), 
                Stripe (procesamiento de pagos), Brevo (envío de correos electrónicos)
              </li>
              <li>
                <strong>Cumplimiento legal:</strong> Cuando sea requerido por ley o autoridades competentes
              </li>
              <li>
                <strong>Protección de derechos:</strong> Para proteger nuestros derechos, propiedad o seguridad
              </li>
              <li>
                <strong>Transferencias empresariales:</strong> En caso de fusión, adquisición o venta de activos
              </li>
            </ul>
          </section>

          {/* Almacenamiento y seguridad */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Almacenamiento y Seguridad de Datos
            </h2>
            <p className="mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Cifrado de datos en tránsito (HTTPS/TLS)</li>
              <li>Almacenamiento seguro en Firebase Firestore</li>
              <li>Autenticación mediante JWT (JSON Web Tokens)</li>
              <li>Control de acceso basado en roles (RBAC)</li>
              <li>Registro de auditoría de todas las acciones importantes</li>
              <li>Copias de seguridad regulares</li>
              <li>Monitoreo continuo de seguridad</li>
            </ul>
            <p className="mb-4">
              Sus datos se almacenan en servidores de <strong>Firebase</strong> (Google Cloud Platform) 
              y pueden estar ubicados en diferentes regiones geográficas para garantizar disponibilidad 
              y rendimiento.
            </p>
          </section>

          {/* Retención de datos */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Retención de Datos
            </h2>
            <p className="mb-4">
              Como aplicación de demostración, conservamos su información durante:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>El tiempo que mantenga su cuenta activa en la plataforma de prueba</li>
              <li>Un período razonable para propósitos de demostración y pruebas</li>
              <li>Hasta que solicite la eliminación de sus datos</li>
            </ul>
            <p className="mb-4">
              Puede solicitar la eliminación completa de sus datos en cualquier momento 
              contactándonos a través de los medios indicados en esta política.
            </p>
            <p className="text-sm text-gray-600">
              Nota: A diferencia de una institución financiera real, no estamos sujetos a 
              requisitos regulatorios de retención de datos por períodos prolongados.
            </p>
          </section>

          {/* Derechos del usuario */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Sus Derechos
            </h2>
            <p className="mb-4">Usted tiene derecho a:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Acceso:</strong> Solicitar una copia de sus datos personales</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
              <li><strong>Eliminación:</strong> Solicitar la eliminación de sus datos (sujeto a obligaciones legales)</li>
              <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado</li>
              <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos</li>
              <li><strong>Limitación:</strong> Solicitar la limitación del procesamiento</li>
              <li><strong>Revocación:</strong> Retirar su consentimiento en cualquier momento</li>
            </ul>
            <p>
              Para ejercer estos derechos, contáctenos a través de los medios indicados en la 
              sección de contacto.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Cookies y Tecnologías Similares
            </h2>
            <p className="mb-4">
              Utilizamos cookies y tecnologías similares para:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Mantener su sesión activa</li>
              <li>Recordar sus preferencias</li>
              <li>Analizar el uso de la plataforma</li>
              <li>Mejorar la seguridad</li>
            </ul>
            <p>
              Puede configurar su navegador para rechazar cookies, pero esto puede afectar la 
              funcionalidad de la plataforma.
            </p>
          </section>

          {/* Menores de edad */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Menores de Edad
            </h2>
            <p>
              Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos 
              intencionalmente información de menores de edad. Si descubrimos que hemos recopilado 
              datos de un menor, eliminaremos esa información de inmediato.
            </p>
          </section>

          {/* Servicios de terceros */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Servicios de Terceros
            </h2>
            <p className="mb-4">Nuestra plataforma integra los siguientes servicios de terceros:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Firebase (Google):</strong> Autenticación, base de datos y almacenamiento
              </li>
              <li>
                <strong>Stripe:</strong> Procesamiento de pagos (modo prueba)
              </li>
              <li>
                <strong>Brevo:</strong> Envío de correos electrónicos transaccionales
              </li>
              <li>
                <strong>Google Maps:</strong> Servicios de geolocalización
              </li>
            </ul>
            <p className="mt-4">
              Estos servicios tienen sus propias políticas de privacidad y no somos responsables 
              de sus prácticas.
            </p>
          </section>

          {/* Cambios a la política */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Cambios a esta Política
            </h2>
            <p className="mb-4">
              Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos 
              sobre cambios significativos mediante:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Notificación en la aplicación</li>
              <li>Correo electrónico</li>
              <li>Aviso destacado en nuestra plataforma</li>
            </ul>
            <p>
              La fecha de "Última actualización" al inicio de este documento indica cuándo se 
              realizó la última modificación.
            </p>
          </section>

          {/* Contacto */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              14. Contacto
            </h2>
            <p className="mb-4">
              Si tiene preguntas, inquietudes o desea ejercer sus derechos sobre sus datos 
              personales, puede contactarnos a través de:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="mb-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@finance.com" className="text-blue-600 hover:underline">
                  privacy@finance.com
                </a>
              </p>
              <p className="mb-2">
                <strong>Soporte:</strong>{' '}
                <a href="mailto:support@finance.com" className="text-blue-600 hover:underline">
                  support@finance.com
                </a>
              </p>
              <p>
                <strong>Horario de atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM
              </p>
            </div>
          </section>

          {/* Aceptación */}
          <section className="border-t pt-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              15. Aceptación de esta Política
            </h2>
            <p className="mb-4">
              Al utilizar nuestra aplicación y servicios de demostración, usted reconoce que:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Ha leído y comprendido esta Política de Privacidad</li>
              <li>Acepta el procesamiento de sus datos según lo descrito en este documento</li>
              <li>
                <strong>Comprende que esta es una aplicación de simulación y demostración</strong>
              </li>
              <li>
                <strong>No se procesan transacciones financieras reales</strong>
              </li>
              <li>
                <strong>Se recomienda usar solo datos ficticios o de prueba</strong>
              </li>
            </ul>
            
            <div className="bg-gray-100 border-l-4 border-gray-500 p-4 mt-6">
              <p className="text-gray-800 font-semibold mb-2">
                Descargo de Responsabilidad
              </p>
              <p className="text-gray-700 text-sm">
                FINANCE es una aplicación de demostración creada con fines educativos y de prueba. 
                No somos una institución financiera regulada. No ofrecemos servicios financieros 
                reales, no otorgamos créditos reales, y no procesamos pagos con dinero real. 
                El uso de esta aplicación es bajo su propio riesgo y responsabilidad.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
          <p>© 2025 FINANCE. Todos los derechos reservados.</p>
          <p className="mt-2">
            Esta política de privacidad es efectiva a partir del 24 de noviembre de 2025.
          </p>
        </div>
      </div>
    </div>
  );
}
