import { MenuItemProp } from '../../types'
// import { v4 as uuid } from 'uuid'
// import { ReactNode } from 'react'
import { LateralMenu } from '@Components/Menu/LateralMenu/LateralMenu'

// type MenuItem = {
//   key: string
//   icon?: ReactNode
//   children?: ReactNode
//   label: string
//   type: string
//   link: string
// }

// function getItem(item: MenuItemProp): MenuItem {
//   return {
//     key: uuid(),
//     icon: item.icon,
//     children: item.children ? item.children.map(getItem) : undefined,
//     label: item.label,
//     type: 'string',
//     link: item.link,
//   } as MenuItem
// }

type Props = {
  menu: MenuItemProp[]
}

export const Sidebar = ({ menu }: Props) => {
  return (
    // <Menu
    //   mode="inline"
    //   theme="dark"
    //   items={menu.map(getItem)}
    //   onClick={(args) => {
    //     const { item } = args
    //     if (item.props.link) {
    //       navigate(item.props.link)
    //     }
    //   }}
    //   triggerSubMenuAction="click"
    // />
    <menu role="menu">
      <LateralMenu
        items={menu.map(({ icon, label, link }) => ({
          label,
          icon,
          onClick: () => {
            if (link) {
              window.location.href = link
            }
          },
        }))}
      />
    </menu>
  )
}
