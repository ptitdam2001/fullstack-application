import { Box } from '@mui/material'
import { Area } from '@Sdk/model'

type AddressProps = {
  address: Area
}

export const Address = ({ address }: AddressProps) => (
  <>
    <Box>{address.name}</Box>
    <Box>
      {address.address} - {address.city}
    </Box>
  </>
)
