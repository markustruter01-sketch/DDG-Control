/** One SVG scene graphic: original scenery, exact supplied mark and painted signs.
 * No generated/redrawn logo, floating HTML name cards or modified raster masters.
 */
export function VillageArtwork() {
  const base = import.meta.env.BASE_URL;
  const signs = [
    {x:365,y:355,w:155,name:'Hypest'},
    {x:1090,y:395,w:222,name:'DDG Finance'},
    {x:250,y:683,w:185,name:'Creative'},
    {x:1205,y:720,w:290,name:'Cattle Dog Coffee'},
    {x:730,y:948,w:200,name:'DDG Music'},
    {x:735,y:636,w:235,name:'DDG Control'},
  ];
  return <svg className="village-artwork" viewBox="0 0 1448 1086" preserveAspectRatio="none" aria-hidden="true">
    <image href={`${base}atlas-viking-village-v2.webp`} width="1448" height="1086" />
    <image href={`${base}ddg-creative-glitch-original.png`} x="758" y="265" width="99" height="77" preserveAspectRatio="xMidYMid meet" style={{mixBlendMode:'screen'}} />
    {signs.map(({x,y,w,name})=><g key={name} transform={`translate(${x} ${y})`}>
      <path d={`M${-w/2} -17H${w/2}v34H${-w/2}Z`} fill="#633f25" stroke="#1d211f" strokeWidth="5" />
      <path d={`M${-w/2+5} -12H${w/2-5}M${-w/2+5} 12H${w/2-5}`} stroke="#c3904f" strokeWidth="3" />
      <circle cx={-w/2+10} cy="0" r="2.5" fill="#dfba79"/><circle cx={w/2-10} cy="0" r="2.5" fill="#dfba79"/>
      <text textAnchor="middle" dominantBaseline="central" fontFamily="monospace" fontWeight="bold" fontSize="23" fill="#fff0c8" stroke="#241b12" strokeWidth=".5" paintOrder="stroke">{name}</text>
    </g>)}
  </svg>;
}
