export default function ForestVine({ leaves }) {
  return <div className="forest-progress" role="progressbar" aria-label="The Forest" aria-valuemin={0} aria-valuemax={10} aria-valuenow={leaves}>
    <svg viewBox="0 0 340 84" fill="none" strokeLinecap="round" aria-hidden="true">
      <path className="forest-vine-guide" d="M14 54Q95 40 175 54T326 54" />
      <path className="forest-vine-stem" d="M14 54Q95 40 175 54T326 54" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - leaves / 10} />
      {Array.from({ length: 10 }, (_, index) => <g key={index} className="forest-vine-leaf" data-grown={index < leaves} transform={`translate(${30 + index * 30} ${index < 5 ? 48 : 58})`}>
        <path d={index % 2 ? "M0 0Q-16 1-19 20Q-1 24 0 0Z" : "M0 0Q-17-1-19-23Q1-22 0 0Z"} />
        <path className="forest-leaf-vein" d={index % 2 ? "M-2 3L-15 17" : "M-2-3L-15-19"} />
      </g>)}
    </svg>
  </div>;
}
