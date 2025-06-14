import { Area } from '@Sdk/model'

type AddressProps = {
  address: Area
}

export const Address = ({ address }: AddressProps) => (
  <>
    <p>{address.name}</p>
    <p>
      {address.address} - {address.city}
    </p>
  </>
)
