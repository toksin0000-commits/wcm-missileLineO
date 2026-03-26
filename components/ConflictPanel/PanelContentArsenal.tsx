"use client";

interface ArsenalGroup {
  country: string;
  categories: Record<string, any[]>;
}

interface PanelContentArsenalProps {
  arsenal?: ArsenalGroup[];
  openWeapons: { [key: string]: boolean };
  onToggleWeapon: (weaponId: string) => void;
}

export default function PanelContentArsenal({ 
  arsenal, 
  openWeapons, 
  onToggleWeapon 
}: PanelContentArsenalProps) {
  
  if (!arsenal) return null;

  return (
    <div style={{ 
      animation: 'fadeIn 0.4s ease-out forwards',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {arsenal.map((group: any, i: number) => (
        <div key={i} style={{
          backgroundColor: 'rgba(0, 242, 255, 0.03)',
          border: '1px solid rgba(0, 242, 255, 0.15)',
          padding: '16px',
          borderRadius: '4px'
        }}>
          <h3 style={{ color: '#00f2ff', fontSize: '13px', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid rgba(0, 242, 255, 0.3)', paddingBottom: '5px', fontFamily: 'monospace' }}>
            {group.country}
          </h3>
          {Object.entries(group.categories || {}).map(([catName, weapons]: any) => (
            <div key={catName} style={{ marginBottom: '12px' }}>
              <h4 style={{ fontSize: '9px', color: '#0891b2', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                {catName}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {weapons.map((weapon: any, idx: number) => {
                  const weaponId = `${group.country}-${catName}-${idx}`;
                  const isOpen = openWeapons[weaponId];
                  const weaponName = typeof weapon === 'string' ? weapon : weapon.name;
                  const weaponData = typeof weapon === 'string' ? null : weapon;
                  
                  return (
                    <div key={idx}>
                      <div 
                        onClick={() => weaponData && onToggleWeapon(weaponId)}
                        style={{ 
                          fontSize: '11px', 
                          color: 'white', 
                          opacity: 0.8, 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          cursor: weaponData ? 'pointer' : 'default',
                          padding: '4px 0',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (weaponData) e.currentTarget.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                          if (weaponData) e.currentTarget.style.opacity = '0.8';
                        }}
                      >
                        <span style={{ width: '3px', height: '3px', background: '#00f2ff' }}></span>
                        {weaponName}
                        {weaponData && (
                          <span style={{ fontSize: '8px', color: '#0891b2' }}>
                            {isOpen ? '▼' : '▶'}
                          </span>
                        )}
                      </div>
                      
                      {isOpen && weaponData && (
                        <div style={{ 
                          marginTop: '8px', 
                          marginLeft: '-16px',
                          marginRight: '-16px',
                          marginBottom: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          borderRadius: '0px',
                          padding: '12px 16px',
                          width: 'calc(100% + 32px)',
                          boxSizing: 'border-box'
                        }}>
                          {weaponData.image && (
                            <img 
                              src={weaponData.image} 
                              alt={weaponData.name}
                              style={{
                                width: '100%',
                                maxHeight: '200px',
                                objectFit: 'contain',
                                borderRadius: '4px',
                                marginBottom: '12px',
                                display: 'block'
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          
                          {weaponData.description && (
                            <p style={{ 
                              fontSize: '11px', 
                              color: 'rgba(0, 242, 255, 0.8)', 
                              marginBottom: '12px',
                              lineHeight: '1.5',
                              fontFamily: 'monospace'
                            }}>
                              {weaponData.description}
                            </p>
                          )}
                          
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '8px',
                            fontSize: '10px',
                            fontFamily: 'monospace'
                          }}>
                            {weaponData.range && (
                              <div>
                                <span style={{ color: '#0891b2' }}>Range:</span>
                                <span style={{ color: 'white', marginLeft: '6px' }}>{weaponData.range}</span>
                              </div>
                            )}
                            {weaponData.speed && (
                              <div>
                                <span style={{ color: '#0891b2' }}>Speed:</span>
                                <span style={{ color: 'white', marginLeft: '6px' }}>{weaponData.speed}</span>
                              </div>
                            )}
                            {weaponData.warhead && (
                              <div>
                                <span style={{ color: '#0891b2' }}>Warhead:</span>
                                <span style={{ color: 'white', marginLeft: '6px' }}>{weaponData.warhead}</span>
                              </div>
                            )}
                            {weaponData.year && (
                              <div>
                                <span style={{ color: '#0891b2' }}>Year:</span>
                                <span style={{ color: 'white', marginLeft: '6px' }}>{weaponData.year}</span>
                              </div>
                            )}
                            {weaponData.status && (
                              <div>
                                <span style={{ color: '#0891b2' }}>Status:</span>
                                <span style={{ color: 'white', marginLeft: '6px' }}>{weaponData.status}</span>
                              </div>
                            )}
                            {weaponData.price && (
                              <div>
                                <span style={{ color: '#0891b2' }}>Price:</span>
                                <span style={{ color: 'white', marginLeft: '6px' }}>{weaponData.price}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}