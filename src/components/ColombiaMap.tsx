import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { useApp } from '../context/AppContext';

import bancarizacionRaw from '../data/bancarizacion.json';

const GEO_URL = '/colombia.json';

const BANCARIZACION: Record<string, number> = bancarizacionRaw;

const sortedBancarizacion = Object.entries(BANCARIZACION).sort((a, b) => b[1] - a[1]);

// Nombres de display para el tooltip del mapa
const DISPLAY_NAMES: Record<string, string> = {
  'SANTAFE DE BOGOTA D.C':                                       'Bogotá D.C.',
  'ANTIOQUIA':                                                   'Antioquia',
  'VALLE DEL CAUCA':                                             'Valle del Cauca',
  'ATLANTICO':                                                   'Atlántico',
  'SANTANDER':                                                   'Santander',
  'RISARALDA':                                                   'Risaralda',
  'CALDAS':                                                      'Caldas',
  'QUINDIO':                                                     'Quindío',
  'CUNDINAMARCA':                                                'Cundinamarca',
  'NORTE DE SANTANDER':                                          'Norte de Santander',
  'BOYACA':                                                      'Boyacá',
  'BOLIVAR':                                                     'Bolívar',
  'HUILA':                                                       'Huila',
  'TOLIMA':                                                      'Tolima',
  'META':                                                        'Meta',
  'ARCHIPIELAGO DE SAN ANDRES PROVIDENCIA Y SANTA CATALINA':    'San Andrés',
  'CESAR':                                                       'Cesar',
  'MAGDALENA':                                                   'Magdalena',
  'NARIÑO':                                                      'Nariño',
  'SUCRE':                                                       'Sucre',
  'CASANARE':                                                    'Casanare',
  'CAUCA':                                                       'Cauca',
  'CORDOBA':                                                     'Córdoba',
  'LA GUAJIRA':                                                  'La Guajira',
  'ARAUCA':                                                      'Arauca',
  'PUTUMAYO':                                                    'Putumayo',
  'CAQUETA':                                                     'Caquetá',
  'CHOCO':                                                       'Chocó',
  'AMAZONAS':                                                    'Amazonas',
  'GUAVIARE':                                                    'Guaviare',
  'VICHADA':                                                     'Vichada',
  'VAUPES':                                                      'Vaupés',
  'GUAINIA':                                                     'Guainía',
};

// Interpolación de color: blanco rosado → rosa oscuro según % bancarización
function pinkScale(value: number): string {
  const min = 24, max = 96;
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const r = Math.round(252 - t * (252 - 157));
  const g = Math.round(231 - t * (231 - 23));
  const b = Math.round(243 - t * (243 - 77));
  return `rgb(${r},${g},${b})`;
}

interface ColombiaMapProps {
  mapWidth?: number;
  mapHeight?: number;
  legendMaxHeight?: number;
  showHint?: boolean;
}

export function ColombiaMap({ mapWidth = 480, mapHeight = 560, legendMaxHeight = 520, showHint = true }: ColombiaMapProps) {
  const { theme, language } = useApp();
  const [tooltip, setTooltip] = useState<{ name: string; value: number; x: number; y: number } | null>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  const dark = theme === 'dark';

  return (
    <div>
      {/* Leyenda degradado + hint de zoom */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-xs text-gray-500 dark:text-gray-400">25%</span>
        <div
          className="h-3 flex-1 rounded-full max-w-xs"
          style={{ background: 'linear-gradient(to right, rgb(252,231,243), rgb(157,23,77))' }}
        />
        <span className="text-xs text-gray-500 dark:text-gray-400">95%</span>
        {showHint && (
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
            {language === 'es'
              ? 'bancarización · scroll, arrastra o usa los botones para hacer zoom'
              : 'financial inclusion · scroll, drag or use the buttons to zoom'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-4">
        {/* Map */}
        <div className="relative mx-auto" style={{ maxWidth: mapWidth, width: '100%' }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [-74, 4], scale: 1400 }}
            width={mapWidth}
            height={mapHeight}
          >
            <ZoomableGroup
              center={[-74, 4]}
              zoom={mapZoom}
              minZoom={1}
              maxZoom={8}
              onMoveEnd={({ zoom }) => setMapZoom(zoom)}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const name  = geo.properties.NOMBRE_DPT as string;
                    const value = BANCARIZACION[name] ?? 40;
                    const isHovered = hoveredDept === name;
                    const isDimmed = !!hoveredDept && !isHovered;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={pinkScale(value)}
                        stroke={isHovered ? (dark ? '#f9a8d4' : '#831843') : (dark ? '#1f2937' : '#ffffff')}
                        strokeWidth={isHovered ? 2 / mapZoom : 0.8 / mapZoom}
                        style={{
                          default:  { outline: 'none', opacity: isDimmed ? 0.35 : 1, transition: 'opacity 150ms ease' },
                          hover:    { outline: 'none', opacity: 0.82, cursor: 'pointer' },
                          pressed:  { outline: 'none' },
                        }}
                        onMouseEnter={(e) => {
                          setTooltip({
                            name: DISPLAY_NAMES[name] ?? name,
                            value,
                            x: e.clientX,
                            y: e.clientY,
                          });
                          setHoveredDept(name);
                        }}
                        onMouseMove={(e) => {
                          setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
                        }}
                        onMouseLeave={() => {
                          setTooltip(null);
                          setHoveredDept(null);
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip flotante */}
          {tooltip && (
            <div
              className="fixed z-50 pointer-events-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 shadow-xl text-sm"
              style={{ left: tooltip.x + 14, top: tooltip.y - 40 }}
            >
              <p className="font-bold text-gray-900 dark:text-white">{tooltip.name}</p>
              <p className="text-pink-600 dark:text-pink-400 font-semibold">{tooltip.value}% bancarizado</p>
            </div>
          )}

          {/* Zoom controls */}
          <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setMapZoom(z => Math.min(8, Number((z + 1).toFixed(2))))}
              className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold leading-none"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setMapZoom(z => Math.max(1, Number((z - 1).toFixed(2))))}
              className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold leading-none"
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setMapZoom(1)}
              className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-[10px] font-semibold leading-none"
              aria-label="Reset zoom"
            >
              RESET
            </button>
          </div>
        </div>

        {/* Legend list */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            {language === 'es' ? 'Departamentos · hover para resaltar' : 'Departments · hover to highlight'}
          </p>
          <div className="space-y-0.5 overflow-y-auto pr-1" style={{ maxHeight: legendMaxHeight }}>
            {sortedBancarizacion.map(([name, value]) => (
              <button
                key={name}
                type="button"
                onMouseEnter={() => setHoveredDept(name)}
                onMouseLeave={() => setHoveredDept(null)}
                className={`w-full flex items-center justify-between gap-2 text-xs px-2 py-1.5 rounded-lg transition-colors text-left ${
                  hoveredDept === name ? 'bg-pink-50 dark:bg-pink-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: pinkScale(value) }} />
                  <span className="truncate text-gray-700 dark:text-gray-300">{DISPLAY_NAMES[name] ?? name}</span>
                </span>
                <span className="text-gray-400 dark:text-gray-500 font-medium flex-shrink-0">{value}%</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
