import type { Meta } from '@storybook/react-vite'
import { Title1, Paragraph, Title2, Title3, SubTitle } from './index'

const meta = {
  title: 'Common/Typography',
  tags: ['autodocs'],
} satisfies Meta<any> /* eslint-disable-line @typescript-eslint/no-explicit-any */

export default meta

export const Default = () => (
  <div>
    <Title1>Title 1</Title1>
    <Title2>Title 2</Title2>
    <Title3>Title 3</Title3>
    <SubTitle>sub Title </SubTitle>
    <Paragraph>
      Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsumLorem ipsum
    </Paragraph>
  </div>
)

export const Title_1 = () => <Title1>Title 1</Title1>

export const Title_2 = () => <Title2>Title 2</Title2>

export const Title_3 = () => <Title3>Title 3</Title3>

export const TitleSub = () => <SubTitle>sub Title </SubTitle>

export const ParagraphExample = () => (
  <Paragraph>
    Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsumLorem ipsum
  </Paragraph>
)
