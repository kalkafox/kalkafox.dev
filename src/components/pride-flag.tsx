import range from 'lodash.range'

export function PrideFlag({ numOfColumns = 10, staggeredDelay = 90 }) {
  return (
    <div className="pride-flag w-20">
      {range(numOfColumns).map((columnIndex) => (
        <div
          key={columnIndex}
          className="pride-flag-column"
          style={{
            animationDelay: `calc(-550ms + ${columnIndex * staggeredDelay}ms)`,
          }}
        />
      ))}
    </div>
  )
}
