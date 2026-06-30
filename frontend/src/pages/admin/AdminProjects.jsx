import ResourceManager from '../../components/admin/ResourceManager.jsx';

export default function AdminProjects() {
  return (
    <ResourceManager
      title="Projects"
      endpoint="/projects/admin"
      writeEndpoint="/projects"
      paginated
      getLabel={(p) => `${p.title} ${p.status === 'draft' ? '(draft)' : ''}`}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'slug', label: 'Slug', type: 'text' },
        { key: 'description', label: 'Short description', type: 'textarea' },
        { key: 'long_description', label: 'Full description', type: 'textarea' },
        { key: 'tech_stack', label: 'Tech stack', type: 'tags' },
        { key: 'github_url', label: 'GitHub URL', type: 'text' },
        { key: 'live_url', label: 'Live URL', type: 'text' },
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'project_date', label: 'Date', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft'] },
        { key: 'featured', label: 'Featured project', type: 'checkbox' },
        { key: 'sort_order', label: 'Sort order', type: 'number' },
      ]}
    />
  );
}
