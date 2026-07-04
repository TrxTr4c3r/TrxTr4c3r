import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'

const docsComponents = getDocsMDXComponents()

// Root re-export required by Nextra 4. Merge any per-page overrides on top of
// the docs theme components.
export function useMDXComponents(
  components?: Record<string, React.ComponentType<unknown>>,
) {
  return {
    ...docsComponents,
    ...components,
  }
}
