document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.admin-section');
    
    // --- Helper function to fetch data and build tables ---
    async function fetchDataAndBuildTable(dataType, tableBodyId, rowBuilder) {
        try {
            const response = await fetch(`admin.php?fetch=${dataType}`);
            const data = await response.json();

            if (data.error) {
                console.error(`Error fetching ${dataType}:`, data.error);
                document.getElementById(tableBodyId).innerHTML = `<tr><td colspan="6" class="p-4 text-center text-red-500">Could not load data.</td></tr>`;
                return;
            }

            const tableBody = document.getElementById(tableBodyId);
            if (!tableBody) return;
            
            tableBody.innerHTML = data.length ? data.map(rowBuilder).join('') : `<tr><td colspan="6" class="p-4 text-center text-gray-500">No data found.</td></tr>`;

        } catch (error) {
            console.error(`Failed to load data for ${dataType}:`, error);
        }
    }

    // --- Template functions to create table rows ---
    const createContactRow = (item) => `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-4">${item.full_name}</td>
            <td class="p-4">${item.email}</td>
            <td class="p-4">${item.company_name || 'N/A'}</td>
            <td class="p-4">${new Date(item.submission_date).toLocaleString()}</td>
            <td class="p-4 space-x-2"><button class="text-blue-600 hover:underline">View</button><button class="text-red-600 hover:underline">Delete</button></td>
        </tr>
    `;
    const createUserRow = (item) => `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-4">${item.user_id}</td>
            <td class="p-4">${item.username}</td>
            <td class="p-4">${item.email}</td>
            <td class="p-4">${item.full_name || 'N/A'}</td>
            <td class="p-4">${new Date(item.created_at).toLocaleDateString()}</td>
            <td class="p-4 space-x-2"><button class="text-blue-600 hover:underline">Edit</button><button class="text-red-600 hover:underline">Delete</button></td>
        </tr>
    `;
    const createAdminRow = (item) => `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-4">${item.admin_id}</td>
            <td class="p-4">${item.username}</td>
            <td class="p-4">${item.email}</td>
            <td class="p-4">${item.full_name || 'N/A'}</td>
            <td class="p-4">${item.last_login ? new Date(item.last_login).toLocaleString() : 'Never'}</td>
            <td class="p-4 space-x-2"><button class="text-blue-600 hover:underline">Edit</button><button class="text-red-600 hover:underline">Delete</button></td>
        </tr>
    `;

    // --- Navigation Logic ---
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);

            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(section => section.classList.add('hidden'));
            if(targetSection) targetSection.classList.remove('hidden');

            switch(targetId) {
                case 'messages-section':
                    fetchDataAndBuildTable('contacts', 'contacts-table-body', createContactRow);
                    break;
                case 'users-section':
                    fetchDataAndBuildTable('users', 'users-table-body', createUserRow);
                    break;
                case 'admins-section':
                    fetchDataAndBuildTable('admins', 'admins-table-body', createAdminRow);
                    break;
            }
        });
    });

    // Initial load
    const initialActiveLink = document.querySelector('.sidebar-link.active');
    if(initialActiveLink) initialActiveLink.click();
});
