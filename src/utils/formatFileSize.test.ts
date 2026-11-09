import { describe, expect, it } from 'vitest'
import { formatFileSize } from './formatFileSize'

describe('formatFileSize', () => {
  it('formats byte counts with readable binary units', () => {
    expect(formatFileSize(512)).toBe('512 B')
    expect(formatFileSize(1572864)).toBe('1.5 MiB')
  })

  it('omits absent or invalid sizes', () => {
    expect(formatFileSize(0)).toBeUndefined()
    expect(formatFileSize(-1)).toBeUndefined()
    expect(formatFileSize(Number.NaN)).toBeUndefined()
  })
})
