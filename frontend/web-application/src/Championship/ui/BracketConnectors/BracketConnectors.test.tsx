import { render } from '@testing-library/react'
import { BracketConnectors } from './BracketConnectors'

describe('BracketConnectors', () => {
  it('renders one path per connector', () => {
    const { container } = render(
      <BracketConnectors
        connectors={[
          { fromRound: 0, fromMatch: 0, toRound: 1, toMatch: 0 },
          { fromRound: 0, fromMatch: 1, toRound: 1, toMatch: 0 },
        ]}
        width={400}
        height={200}
        colW={176}
        xLeft={roundIndex => roundIndex * 220}
        centerY={(_roundIndex, matchIndex) => matchIndex * 60 + 30}
      />
    )

    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('renders no path when there are no connectors', () => {
    const { container } = render(
      <BracketConnectors
        connectors={[]}
        width={400}
        height={200}
        colW={176}
        xLeft={roundIndex => roundIndex * 220}
        centerY={(_roundIndex, matchIndex) => matchIndex * 60 + 30}
      />
    )

    expect(container.querySelectorAll('path')).toHaveLength(0)
  })

  it('draws a connector as an H-V-H path between the two round columns', () => {
    const { container } = render(
      <BracketConnectors
        connectors={[{ fromRound: 0, fromMatch: 0, toRound: 1, toMatch: 0 }]}
        width={400}
        height={200}
        colW={176}
        xLeft={roundIndex => roundIndex * 220}
        centerY={() => 30}
      />
    )

    const path = container.querySelector('path')
    expect(path).toHaveAttribute('d', 'M176 30 H198 V30 H220')
  })
})
