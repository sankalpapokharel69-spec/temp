import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Sparkles, 
  Eye, 
  X, 
  Check, 
  Upload, 
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { StorageService } from '../../utils/storage';
import { Template } from '../../types';
import { useToast } from '../../context/ToastContext';

interface AdminTemplatesProps {
  navigate: (route: string) => void;
  onPreview: (template: Template) => void;
}

export const AdminTemplates: React.FC<AdminTemplatesProps> = ({ navigate, onPreview }) => {
  const { success, error, info } = useToast();

  const [templates, setTemplates] = useState<Template[]>(() => StorageService.getTemplates());
  const [categories] = useState(() => StorageService.getCategories());
  const [search, setSearch] = useState('');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'restaurant');
  const [price, setPrice] = useState(39);
  const [originalPrice, setOriginalPrice] = useState(59);
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [pagesCount, setPagesCount] = useState(5);
  const [demoUrl, setDemoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.categoryId.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingTemplate(null);
    setTitle('');
    setCategoryId(categories[0]?.id || 'restaurant');
    setPrice(39);
    setOriginalPrice(59);
    setShortDesc('');
    setDescription('');
    setFeaturesInput('100% Mobile Responsive\nInteractive Components\nClean Vanilla JS\nCommercial License');
    setPagesCount(5);
    setDemoUrl('');
    setThumbnailUrl('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80');
    setGalleryInput('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80');
    setIsFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (tpl: Template) => {
    setEditingTemplate(tpl);
    setTitle(tpl.title);
    setCategoryId(tpl.categoryId);
    setPrice(tpl.price);
    setOriginalPrice(tpl.originalPrice || tpl.price + 20);
    setShortDesc(tpl.shortDesc);
    setDescription(tpl.description);
    setFeaturesInput(tpl.features.join('\n'));
    setPagesCount(tpl.pagesCount);
    setDemoUrl(tpl.demoUrl || '');
    setThumbnailUrl(tpl.thumbnailUrl);
    setGalleryInput(tpl.gallery.join('\n'));
    setIsFeatured(!!tpl.isFeatured);
    setModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailUrl(reader.result as string);
        info('Screenshot Uploaded', 'Template image saved to asset store.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDesc.trim() || !description.trim()) {
      error('Missing fields', 'Title, short description, and full description are required.');
      return;
    }

    const features = featuresInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const gallery = galleryInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (gallery.length === 0 && thumbnailUrl) {
      gallery.push(thumbnailUrl);
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (editingTemplate) {
      // Update
      const updated = StorageService.updateTemplate(editingTemplate.id, {
        title: title.trim(),
        slug,
        categoryId,
        price: Number(price),
        originalPrice: Number(originalPrice),
        shortDesc: shortDesc.trim(),
        description: description.trim(),
        features,
        pagesCount: Number(pagesCount),
        demoUrl: demoUrl.trim(),
        thumbnailUrl: thumbnailUrl.trim(),
        gallery,
        isFeatured,
      });
      if (updated) {
        success('Template Updated', `${title} updated successfully.`);
      }
    } else {
      // Create new
      StorageService.addTemplate({
        title: title.trim(),
        slug,
        categoryId,
        price: Number(price),
        originalPrice: Number(originalPrice),
        shortDesc: shortDesc.trim(),
        description: description.trim(),
        features,
        pagesCount: Number(pagesCount),
        demoUrl: demoUrl.trim(),
        thumbnailUrl: thumbnailUrl.trim(),
        gallery,
        isFeatured,
        reviewsCount: 1,
      });
      success('Template Created', `${title} added to the store.`);
    }

    setTemplates(StorageService.getTemplates());
    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete template "${name}"? This action cannot be undone.`)) {
      StorageService.deleteTemplate(id);
      setTemplates(StorageService.getTemplates());
      success('Template Deleted', `Template was removed from the store.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Poppins']">
            Templates Catalog Manager
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, edit, upload screenshots, or configure pricing for your website templates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Template</span>
          </button>
        </div>
      </div>

      {/* Templates Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3 font-semibold">Preview</th>
                <th className="px-6 py-3 font-semibold">Template Title</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Price</th>
                <th className="px-6 py-3 font-semibold">Pages</th>
                <th className="px-6 py-3 font-semibold">Sales</th>
                <th className="px-6 py-3 font-semibold">Featured</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTemplates.map(tpl => (
                <tr key={tpl.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-3">
                    <img
                      src={tpl.thumbnailUrl}
                      alt={tpl.title}
                      className="w-14 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <strong className="text-slate-900 dark:text-white block font-medium max-w-xs truncate">
                      {tpl.title}
                    </strong>
                    <span className="text-[11px] text-slate-400 font-mono">/{tpl.slug}</span>
                  </td>
                  <td className="px-6 py-3 font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                    {tpl.categoryId}
                  </td>
                  <td className="px-6 py-3 font-bold font-mono text-slate-900 dark:text-white">
                    ${tpl.price}
                  </td>
                  <td className="px-6 py-3 text-slate-600 dark:text-slate-400">
                    {tpl.pagesCount} pages
                  </td>
                  <td className="px-6 py-3 font-mono font-medium text-emerald-600">
                    {tpl.salesCount} sold
                  </td>
                  <td className="px-6 py-3">
                    {tpl.isFeatured ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Featured
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Standard</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onPreview(tpl)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                        title="Live Demo"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(tpl)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                        title="Edit Template"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tpl.id, tpl.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                        title="Delete Template"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
                {editingTemplate ? 'Edit Template' : 'Add New Website Template'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Template Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Gourmet Haven - Luxury Restaurant Template"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min="5"
                    max="500"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Original Price ($ USD)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Short Description (Catalog Cards) *
                </label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="One sentence summary of the template"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full In-Depth Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed breakdown of layout sections and styling..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Key Features (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    placeholder="Interactive Food Menu&#10;Reservation Booking Modal&#10;Google Schema Rich Snippet"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none font-mono"
                  ></textarea>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Additional Gallery URLs (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={galleryInput}
                    onChange={(e) => setGalleryInput(e.target.value)}
                    placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none font-mono text-[11px]"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Thumbnail Image URL or Screenshot Upload
                  </label>
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none mb-1 text-[11px]"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-[11px] text-slate-500"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Pages Count
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={pagesCount}
                      onChange={(e) => setPagesCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Mark as Featured on Homepage
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
                >
                  {editingTemplate ? 'Save Template Changes' : 'Create & Publish Template'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
