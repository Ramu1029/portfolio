import ResourceManager from '../../components/admin/ResourceManager.jsx';

export default function AdminCertifications() {
  return (
    <ResourceManager
      title="Certifications"
      endpoint="/certifications"
      getLabel={(c) => `${c.title} — ${c.issuer}`}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'issuer', label: 'Issuer', type: 'text' },
        { key: 'issue_date', label: 'Issue date', type: 'text' },
        { key: 'credential_url', label: 'Credential URL', type: 'text' },
        { key: 'image', label: 'Badge image', type: 'image' },
        { key: 'sort_order', label: 'Sort order', type: 'number' },
      ]}
    />
  );
}
