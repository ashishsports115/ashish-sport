'use client';

import { useEffect, useState } from 'react';
import type { Contact } from '@/types';

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await fetch('/api/contacts');
            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            }
            const { data } = await response.json();
            setContacts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 font-light">Loading contacts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                    <p className="text-sm font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-2 tracking-tight">
                    Contact Requests
                </h1>
                <p className="text-gray-600 font-light">View and manage customer inquiries</p>
            </div>

            {contacts.length === 0 ? (
                <div className="bg-white border border-gray-200 p-16 text-center">
                    <p className="text-gray-400 text-lg font-light">No contact requests yet.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Mobile
                                    </th>
                                    <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Message
                                    </th>
                                    <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Outfit ID
                                    </th>
                                    <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                                            {contact.name}
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {contact.mobile}
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-sm text-gray-600 max-w-md">
                                            <p className="line-clamp-2">{contact.message}</p>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {contact.outfit_id ? (
                                                <a
                                                    href={`/outfit/${contact.outfit_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-black hover:opacity-70 transition-opacity underline"
                                                >
                                                    {contact.outfit_id.substring(0, 8)}...
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(contact.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

