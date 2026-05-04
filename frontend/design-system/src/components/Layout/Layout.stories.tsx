import type { Meta, StoryObj } from '@storybook/react-vite'

import { Layout } from './Layout'

const meta = {
  component: Layout.Root,
  decorators: [
    Story => (
      <div className="h-64 w-full border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Layout.Root>

export default meta

type Story = StoryObj<typeof meta>

// ─── Primitives ───────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Layout.Root>
      <Layout.Header className="border-b px-4 py-2 font-medium">Header</Layout.Header>
      <Layout.Content className="p-4">
        <p>Main content. Scrollable when overflow.</p>
      </Layout.Content>
      <Layout.Footer className="border-t px-4 py-2 text-sm">Footer</Layout.Footer>
    </Layout.Root>
  ),
}

export const WithoutFooter: Story = {
  render: () => (
    <Layout.Root>
      <Layout.Header className="border-b px-4 py-2 font-medium">Header</Layout.Header>
      <Layout.Content className="p-4">
        <p>Content without footer.</p>
      </Layout.Content>
    </Layout.Root>
  ),
}

export const ContentAlignCenter: Story = {
  render: () => (
    <Layout.Root>
      <Layout.Header className="border-b px-4 py-2 font-medium">Header</Layout.Header>
      <Layout.Content align="center" className="p-4">
        <p className="w-64 rounded border p-2">Centered block</p>
      </Layout.Content>
    </Layout.Root>
  ),
}

export const ContentAlignStart: Story = {
  render: () => (
    <Layout.Root>
      <Layout.Header className="border-b px-4 py-2 font-medium">Header</Layout.Header>
      <Layout.Content align="start" className="p-4">
        <p className="w-32 rounded border p-2">Start block</p>
      </Layout.Content>
    </Layout.Root>
  ),
}

export const ScrollableContent: Story = {
  render: () => (
    <Layout.Root>
      <Layout.Header className="border-b px-4 py-2 font-medium">Sticky Header</Layout.Header>
      <Layout.Content className="p-4">
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} className="py-1">
            Line {i + 1}
          </p>
        ))}
      </Layout.Content>
      <Layout.Footer className="border-t px-4 py-2 text-sm">Sticky Footer</Layout.Footer>
    </Layout.Root>
  ),
}

// ─── Sub-layouts ──────────────────────────────────────────────────────────────

/**
 * Header global + sidebar fixe + contenu scrollable indépendamment.
 * Pattern : ConnectedLayout sans Sidebar component.
 */
export const SidebarLayout: Story = {
  decorators: [
    Story => (
      <div className="h-80 w-full border">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Layout.Root>
      <Layout.Header className="bg-muted border-b px-4 py-2 font-semibold">App Header</Layout.Header>

      {/* Horizontal split : sidebar + content */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="flex w-40 shrink-0 flex-col gap-1 border-r p-3">
          <span className="text-muted-foreground mb-1 text-xs font-medium uppercase">Navigation</span>
          {['Dashboard', 'Teams', 'Settings'].map(item => (
            <div key={item} className="hover:bg-accent cursor-pointer rounded px-2 py-1 text-sm">
              {item}
            </div>
          ))}
        </aside>

        <Layout.Content className="p-4">
          <p>Page content — scrollable indépendamment du sidebar.</p>
        </Layout.Content>
      </div>
    </Layout.Root>
  ),
}

/**
 * Header global + sidebar + colonne droite avec son propre footer.
 * Montre un Layout.Root imbriqué dans la zone droite.
 */
export const DashboardLayout: Story = {
  decorators: [
    Story => (
      <div className="h-80 w-full border">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Layout.Root>
      <Layout.Header className="bg-muted border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Dashboard</span>
          <span className="text-muted-foreground text-xs">user@example.com</span>
        </div>
      </Layout.Header>

      {/* Horizontal split */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="flex w-40 shrink-0 flex-col gap-1 border-r p-3">
          {['Overview', 'Analytics', 'Reports', 'Teams', 'Settings'].map(item => (
            <div key={item} className="hover:bg-accent cursor-pointer rounded px-2 py-1 text-sm">
              {item}
            </div>
          ))}
        </aside>

        {/* Colonne droite : Layout imbriqué avec footer propre */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Layout.Content className="p-4">
            <p>Contenu principal — scrollable.</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Le footer ci-dessous est scopé à cette colonne, pas à la page entière.
            </p>
          </Layout.Content>
          <Layout.Footer className="border-t px-4 py-2 text-xs">
            Dernière mise à jour : il y a 5 min
          </Layout.Footer>
        </div>
      </div>
    </Layout.Root>
  ),
}

/**
 * Header + deux panneaux côte à côte, chacun scrollable indépendamment.
 * Pattern : diff viewer, comparaison, éditeur + preview.
 */
export const SplitPanelLayout: Story = {
  decorators: [
    Story => (
      <div className="h-80 w-full border">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Layout.Root>
      <Layout.Header className="bg-muted border-b px-4 py-2 font-medium">Split Panel</Layout.Header>

      {/* Deux panneaux égaux */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Layout.Content className="border-r p-4">
          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase">Panneau gauche</p>
          {Array.from({ length: 15 }, (_, i) => (
            <p key={i} className="py-0.5 text-sm">
              Ligne {i + 1}
            </p>
          ))}
        </Layout.Content>

        <Layout.Content className="p-4">
          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase">Panneau droit</p>
          {Array.from({ length: 15 }, (_, i) => (
            <p key={i} className="py-0.5 text-sm">
              Ligne {i + 1}
            </p>
          ))}
        </Layout.Content>
      </div>
    </Layout.Root>
  ),
}

/**
 * Sans header — blocs empilés dans Layout.Content.
 * Pattern : page de settings, formulaire multi-sections, dashboard sans topbar.
 */
export const ContentOnlyWithBlocks: Story = {
  decorators: [
    Story => (
      <div className="h-96 w-full border">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Layout.Root>
      <Layout.Content className="gap-6 p-6">
        {[
          { title: 'Profil', desc: 'Nom, avatar, email' },
          { title: 'Sécurité', desc: 'Mot de passe, 2FA' },
          { title: 'Notifications', desc: 'Email, push, SMS' },
        ].map(({ title, desc }) => (
          <div key={title} className="rounded-lg border p-4">
            <p className="mb-1 font-medium">{title}</p>
            <p className="text-muted-foreground text-sm">{desc}</p>
          </div>
        ))}
      </Layout.Content>

      <Layout.Footer className="border-t px-6 py-2 text-xs">Enregistré automatiquement</Layout.Footer>
    </Layout.Root>
  ),
}

/**
 * Layout imbriqué dans Layout.Content.
 * Possible car Layout.Content est un <div> (pas un <main>).
 * Pattern : sous-zone avec son propre header/content/footer scopé.
 */
export const NestedLayout: Story = {
  decorators: [
    Story => (
      <div className="h-96 w-full border">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Layout.Root>
      <Layout.Header className="bg-muted border-b px-4 py-2 font-semibold">Page Header</Layout.Header>

      <Layout.Content className="gap-4 p-4">
        <p className="text-muted-foreground text-sm">Contenu de la page (niveau 1).</p>

        {/* Sous-layout : Layout complet imbriqué dans Layout.Content */}
        <Layout.Root className="min-h-0 flex-1 rounded-lg border">
          <Layout.Header className="bg-muted/50 border-b px-3 py-1.5 text-sm font-medium">
            Sub-layout Header
          </Layout.Header>
          <Layout.Content className="p-3">
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i} className="py-0.5 text-sm">
                Ligne {i + 1} — contenu scrollable du sous-layout
              </p>
            ))}
          </Layout.Content>
          <Layout.Footer className="border-t px-3 py-1.5 text-xs">Sub-layout Footer</Layout.Footer>
        </Layout.Root>
      </Layout.Content>

      <Layout.Footer className="border-t px-4 py-2 text-xs">Page Footer</Layout.Footer>
    </Layout.Root>
  ),
}

/**
 * Page auth : header minimal + contenu centré + footer de mentions.
 * Composition typique pour login / register.
 */
export const AuthPageLayout: Story = {
  decorators: [
    Story => (
      <div className="h-96 w-full border">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Layout.Root>
      <Layout.Header className="border-b px-6 py-3">
        <span className="font-semibold">MyApp</span>
      </Layout.Header>

      <Layout.Content align="center" className="p-8">
        <div className="w-full max-w-sm rounded-lg border p-6 shadow-sm">
          <p className="mb-1 text-lg font-semibold">Connexion</p>
          <p className="text-muted-foreground text-sm">Formulaire centré dans la page.</p>
        </div>
      </Layout.Content>

      <Layout.Footer className="border-t px-6 py-2 text-center text-xs">
        © 2025 MyApp — CGU
      </Layout.Footer>
    </Layout.Root>
  ),
}
