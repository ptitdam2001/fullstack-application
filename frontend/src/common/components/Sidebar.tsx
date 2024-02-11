import { MenuItemProp } from '../../../types'
// import { v4 as uuid } from 'uuid'
import { useNavigate } from 'react-router-dom'
// import { ReactNode } from 'react'
import { LateralMenu } from './Menu'

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
  const navigate = useNavigate()

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
    <span role="menu">
      <LateralMenu
        items={menu.map(({ icon, label, link }) => ({
          label,
          icon,
          onClick: () => {
            if (link) {
              navigate(link)
            }
          },
        }))}
      />
    </span>
  )
}
