import ResourceManager from '../../components/admin/ResourceManager.jsx';

export default function AdminExperience() {
  return (
    <ResourceManager
      title="Experience"
      endpoint="/experience"
      getLabel={(e) => `${e.role} @ ${e.company}`}
      fields={[
        { key: 'role', label: 'Role', type: 'text' },
        { key: 'company', label: 'Company', type: 'text' },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'start_date', label: 'Start date', type: 'text' },
        { key: 'end_date', label: 'End date', type: 'text' },
        { key: 'current', label: 'Currently working here', type: 'checkbox' },
        { key: 'type', label: 'Type', type: 'select', options: ['fulltime', 'freelance', 'internship', 'contract'] },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'tech_stack', label: 'Tech stack', type: 'tags' },
        { key: 'sort_order', label: 'Sort order', type: 'number' },
      ]}
    />
  );
}
