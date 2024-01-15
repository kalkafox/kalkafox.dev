import { useState } from 'react'
import { Button } from './ui/button'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <Button onClick={() => setCount((e) => ++e)}>
      {count >= 1 ? count : 'click me'}
    </Button>
  )
}

export default Counter
