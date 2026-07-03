import type { Area } from '../domain/Area'

type AreaDisplayProps = {
  address: Area
}

export const AreaDisplay = ({ address }: AreaDisplayProps) => (
  <>
    <p>{address.name}</p>
    <p>
      {address.address} - {address.city}
    </p>
  </>
)
