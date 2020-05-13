import styled from 'styled-components'

export const A = styled.a.attrs((props) => ({
  href: props.to || props.href,
  target: '_blank',
  rel: 'noopener',
}))`
  text-decoration: none;
`
