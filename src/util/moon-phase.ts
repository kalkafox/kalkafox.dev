// moon phase algorithm was implemented from http://www.voidware.com/moon_phase.htm
// and modified to work with typescript
export function getMoonPhase() {
  // do the same thing, but multiply by the reciprocal instead of dividing
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()

  const c = Math.floor(year * (1 / 100))
  const e = 2 - c + Math.floor(c * (1 / 4))
  const jd =
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    e -
    1524

  const b = (jd - 2451550.1) * (1 / 29.530588853)
  const a = Math.floor(b)
  const phase = b - a

  // Return the moon phase as a number between 0 and 7
  const moonPhase = Math.floor(phase * 8)

  // this means 0 is new moon, 1 is waxing crescent, 2 is first quarter, 3 is waxing gibbous, 4 is full moon, 5 is waning gibbous, 6 is last quarter, 7 is waning crescent
  return moonPhase
}

function calculateLunarPhase(): number {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // Note: Months are zero-based in JavaScript
  const day = now.getDate()

  // Calculate Julian Day
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045

  // Calculate the number of days since the last new moon
  const daysSinceNewMoon = jd - 2451550.1

  // Calculate the current lunar phase (0 to 29.5)
  const lunarPhase = (daysSinceNewMoon % 29.53058867) / 29.53058867 //* 8,

  return lunarPhase
}

function getMoonIcon(moonPhase: number) {
  let moon_icon = ''

  console.log(moonPhase)

  if (moonPhase < 0.03) {
    moon_icon = 'mdi:moon-new'
  } else if (moonPhase < 0.13) {
    moon_icon = 'mdi:moon-waxing-crescent'
  } else if (moonPhase < 0.5) {
    moon_icon = 'mdi:moon-first-quarter'
  } else if (moonPhase < 0.53) {
    moon_icon = 'mdi:moon-waxing-gibbous'
  } else if (moonPhase < 0.97) {
    moon_icon = 'mdi:moon-full'
  } else if (moonPhase < 1) {
    moon_icon = 'mdi:moon-waning-gibbous'
  } else if (moonPhase < 1.03) {
    moon_icon = 'mdi:moon-last-quarter'
  } else {
    moon_icon = 'mdi:moon-waning-crescent'
  }

  return moon_icon
}

const moonPhase = () => getMoonIcon(calculateLunarPhase())

export default moonPhase
