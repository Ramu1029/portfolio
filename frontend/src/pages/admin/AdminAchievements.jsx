import ResourceManager from '../../components/admin/ResourceManager.jsx';

export default function AdminAchievements() {
  return (
    <ResourceManager
      title="Achievements"
      endpoint="/achievements"
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'date', label: 'Date', type: 'text' },
        { key: 'link', label: 'Link (optional)', type: 'text' },
        { key: 'sort_order', label: 'Sort order', type: 'number' },
      ]}
    />
  );
}
