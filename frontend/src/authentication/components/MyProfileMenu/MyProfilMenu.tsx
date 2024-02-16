import { DropDown, DropDownItem, UserAccount } from '@Common/components'

type Props = {
  myProfilePath?: string
  otherMenuElements?: DropDownItem[]
}

export const MyProfilMenu = ({ myProfilePath = '/app/my-profile', otherMenuElements = [] }: Props) => {
  const items: DropDownItem[] = [
    {
      label: 'My profile',
      link: myProfilePath,
    },
    ...otherMenuElements,
  ]

  return <DropDown icon={<UserAccount />} items={items} closeOnClick />
}
