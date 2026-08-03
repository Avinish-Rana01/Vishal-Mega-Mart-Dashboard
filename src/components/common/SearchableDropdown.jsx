import React, { useState, useEffect, useRef } from 'react';

export default function SearchableDropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  isAsync = false,
  onSearchChange,
  isLoading = false,
  labelKey = 'text',
  valueKey = 'value',
  searchPlaceholder = 'Search...',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);
  
  // The displayed text in the trigger
  const selectedOption = options.find(opt => opt[valueKey] === value) || (value ? { [labelKey]: value, [valueKey]: value } : null);
  
  // Local filtering if not async
  const displayOptions = isAsync 
    ? options 
    : options.filter(opt => (opt[labelKey] || '').toString().toLowerCase().includes(searchTerm.toLowerCase()));

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('', null);
    setSearchTerm('');
    if (isAsync && onSearchChange) {
      onSearchChange('');
    }
  };

  // Auto-focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="custom-select-container" style={{ position: 'relative', width: '100%' }}>
      <div 
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          padding: '0 15px', 
          width: '100%', 
          height: '38px', 
          borderRadius: '13px', 
          background: '#f8fafc', 
          border: '1px solid #cbd5e1', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          cursor: 'pointer' 
        }}
      >
        <span style={{ fontSize: '13px', color: value ? '#334155' : '#94a3b8' }}>
          {selectedOption ? selectedOption[labelKey] : placeholder}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {value && (
            <div 
              onClick={handleClear}
              style={{ color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          )}
          {!value && (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: '#94a3b8' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          )}
        </div>
      </div>
      
      {isOpen && (
        <>
          <div 
            className="custom-select-backdrop" 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }} 
            onClick={() => setIsOpen(false)}
          />
          <div className="custom-select-menu" style={{ padding: '8px 0', zIndex: 100 }}>
            {/* Search Input Box inside Dropdown */}
            <div style={{ padding: '0 8px 8px 8px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (isAsync && onSearchChange) {
                      onSearchChange(e.target.value);
                    }
                  }}
                  placeholder={searchPlaceholder}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    color: '#334155'
                  }}
                />
              </div>
            </div>

            {/* Options List */}
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {isLoading ? (
                <div className="custom-select-option" style={{ color: '#ef4444', fontStyle: 'italic', cursor: 'default' }}>Searching...</div>
              ) : displayOptions.length > 0 ? (
                displayOptions.map(opt => {
                  const isSelected = opt[valueKey] === value;
                  return (
                    <div 
                      key={opt[valueKey]} 
                      className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      onClick={() => {
                        onChange(opt[valueKey], opt);
                        setIsOpen(false);
                      }}
                    >
                      <span>{opt[labelKey]}</span>
                      {isSelected && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="custom-select-option" style={{ color: '#94a3b8', fontStyle: 'italic', cursor: 'default' }}>
                  {searchTerm ? 'No results found' : 'Type to search...'}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
