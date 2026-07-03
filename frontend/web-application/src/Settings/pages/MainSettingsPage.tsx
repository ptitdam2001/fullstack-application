import { Grid } from '@repo/design-system'
import { useSettingsMenu } from '@Settings/hooks/useSettingsMenu'
import { useNavigate } from 'react-router'

export const MainSettingsPage = () => {
  const { list } = useSettingsMenu()
  const navigate = useNavigate()

  const items = list.map(item => ({ ...item, id: item.href }))

  return (
    <div className="h-full w-full p-2">
      <Grid.Root
        aria-label="Paramètres"
        items={items}
        onAction={key => navigate(key as string)}
        className="h-full"
        layoutOptions={{ minItemSize: { width: 160, height: 120 } }}
      >
        {item => (
          <Grid.Item id={item.id} textValue={item.label}>
            <div className="bg-card text-card-foreground flex h-full flex-col items-center justify-center gap-2 rounded-md border p-4">
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          </Grid.Item>
        )}
      </Grid.Root>
    </div>
  )
}
