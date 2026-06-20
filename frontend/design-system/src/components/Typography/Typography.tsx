import { TypographyBody } from './TypographyBody'
import { TypographyBodySmall } from './TypographyBodySmall'
import { TypographyCaption } from './TypographyCaption'
import { TypographySubtitle } from './TypographySubtitle'
import { TypographyTitle1 } from './TypographyTitle1'
import { TypographyTitle2 } from './TypographyTitle2'
import { TypographyTitle3 } from './TypographyTitle3'

export const Typography = Object.assign(TypographyBody, {
  Title1: TypographyTitle1,
  Title2: TypographyTitle2,
  Title3: TypographyTitle3,
  Subtitle: TypographySubtitle,
  Body: TypographyBody,
  BodySmall: TypographyBodySmall,
  Caption: TypographyCaption,
})