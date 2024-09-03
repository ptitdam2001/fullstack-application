import { PopoverProvider } from './Provider/PopoverProvider'
import { PopoverTrigger } from './Trigger/PopoverTrigger'
import { PopoverContent } from './Content/PopoverContent'

export const Popover = {
  Container: PopoverProvider,
  Content: PopoverContent,
  Trigger: PopoverTrigger,
}
