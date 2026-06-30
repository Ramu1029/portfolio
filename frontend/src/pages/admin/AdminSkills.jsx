import ResourceManager from '../../components/admin/ResourceManager.jsx';

export default function AdminSkills() {
  return (
    <ResourceManager
      title="Skills"
      endpoint="/skills"
      getLabel={(s) => `${s.name} — ${s.category} (${s.proficiency}%)`}
      fields={[
        { key: 'name', label: 'Skill name', type: 'text' },
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'proficiency', label: 'Proficiency (0-100)', type: 'number' },
        { key: 'icon', label: 'Icon (optional)', type: 'text' },
        { key: 'sort_order', label: 'Sort order', type: 'number' },
      ]}
    />
  );
}
