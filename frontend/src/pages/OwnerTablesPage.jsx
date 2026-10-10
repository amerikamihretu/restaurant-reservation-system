/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { tableApi } from '../api/table.api';

const emptyForm = { tableNumber: '', capacity: 2, minSeats: 1, location: 'Indoor' };

export const OwnerTablesPage = () => {
    const [tables, setTables] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const loadTables = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await tableApi.getMyTables();
            setTables(response.data.tables);
        } catch (err) {
            setError(err.message || 'Failed to load tables');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadTables(); }, []);

    const submit = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
            setError('');
            setMessage('');
            if (editingId) await tableApi.updateTable(editingId, form);
            else await tableApi.createTable(form);
            setForm(emptyForm);
            setEditingId(null);
            setMessage('Table saved successfully.');
            await loadTables();
        } catch (err) {
            setError(err.message || 'Failed to save table');
        } finally {
            setSaving(false);
        }
    };

    const edit = (table) => {
        setEditingId(table._id);
        setForm({
            tableNumber: table.tableNumber,
            capacity: table.capacity,
            minSeats: table.minSeats,
            location: table.location || 'Indoor',
        });
        setMessage('');
        setError('');
    };

    const remove = async (id) => {
        if (!window.confirm('Delete this table? Existing reservations are not deleted.')) return;
        try {
            setError('');
            await tableApi.deleteTable(id);
            if (editingId === id) {
                setEditingId(null);
                setForm(emptyForm);
            }
            await loadTables();
        } catch (err) {
            setError(err.message || 'Failed to delete table');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Table Management</h1>
            <p className="text-slate-600 mb-8">Define the tables customers can reserve after your restaurant is approved.</p>
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}
            {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">{message}</div>}
            <form onSubmit={submit} className="bg-white rounded-xl border border-slate-200 p-6 mb-6 grid gap-4 sm:grid-cols-4">
                <input required placeholder="Table number" value={form.tableNumber} onChange={(e) => setForm({ ...form, tableNumber: e.target.value })} className="px-3 py-2 border rounded-lg" />
                <input required type="number" min="1" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} className="px-3 py-2 border rounded-lg" />
                <input required type="number" min="1" placeholder="Minimum seats" value={form.minSeats} onChange={(e) => setForm({ ...form, minSeats: Number(e.target.value) })} className="px-3 py-2 border rounded-lg" />
                <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="px-3 py-2 border rounded-lg" />
                <div className="sm:col-span-4 flex gap-3">
                    <button disabled={saving} className="px-4 py-2 bg-orange-600 text-white rounded-lg disabled:opacity-50">{saving ? 'Saving...' : editingId ? 'Update table' : 'Add table'}</button>
                    {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="px-4 py-2 border rounded-lg">Cancel</button>}
                </div>
            </form>
            {loading ? <p className="text-slate-500">Loading tables...</p> : tables.length === 0 ? <p className="text-slate-500">No tables configured yet.</p> : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    {tables.map((table) => (
                        <div key={table._id} className="p-4 border-b last:border-b-0 flex items-center justify-between">
                            <div><strong>Table {table.tableNumber}</strong><span className="text-sm text-slate-500 ml-3">{table.minSeats}-{table.capacity} seats · {table.location}</span></div>
                            <div className="flex gap-2"><button onClick={() => edit(table)} className="px-3 py-1 text-sm border rounded-lg">Edit</button><button onClick={() => remove(table._id)} className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-lg">Delete</button></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
