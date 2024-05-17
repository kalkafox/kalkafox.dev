// Pride flag -- thanks to https://www.joshwcomeau.com/animation/pride-flags/

import range from 'lodash.range'

export function PrideFlag({ numOfColumns = 10, staggeredDelay = 90 }) {
  return (
    <div className="pride-flag w-10">
      {range(numOfColumns).map((columnIndex) => (
        <div
          key={columnIndex}
          className="pride-flag-column"
          style={{
            animationDelay: columnIndex * staggeredDelay + 'ms',
          }}
        />
      ))}
    </div>
  )
}
