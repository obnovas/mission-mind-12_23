import React from 'react';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { FormField } from '../../common/forms/FormField';
import { SelectField } from '../../common/forms/SelectField';
import { useSettingsStore } from '../../../store/settingsStore';
import { ContactType, CheckInFrequency } from '../../../types';

interface FormData {
  name: string;
  type: ContactType;
  email: string;
  phone: string;
  address: string;
  notes: string;
  check_in_frequency: CheckInFrequency;
}

interface ContactFormFieldsProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export function ContactFormFields({ formData, onChange }: ContactFormFieldsProps) {
  const { settings } = useSettingsStore();
  const checkInFrequencies: CheckInFrequency[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-neutral-50 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-neutral-900">Basic Information</h3>
          
          <SelectField
            id="type"
            name="type"
            label="Contact Type"
            value={formData.type}
            onChange={onChange}
            options={settings.contactTypes.map(type => ({
              value: type,
              label: type
            }))}
            required
          />

          <FormField
            id="name"
            name="name"
            label="Name"
            value={formData.name}
            onChange={onChange}
            required
            icon={User}
          />
        </div>

        {/* Contact Information */}
        <div className="bg-neutral-50 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-neutral-900">Contact Information</h3>
          
          <FormField
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={onChange}
            icon={Mail}
          />

          <FormField
            id="phone"
            name="phone"
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            icon={Phone}
          />

          <FormField
            id="address"
            name="address"
            label="Address"
            value={formData.address}
            onChange={onChange}
            icon={MapPin}
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Check-in Settings */}
        <div className="bg-neutral-50 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-neutral-900">{settings.checkInLabel} Settings</h3>
          
          <SelectField
            id="check_in_frequency"
            name="check_in_frequency"
            label={`${settings.checkInLabel} Frequency`}
            value={formData.check_in_frequency}
            onChange={onChange}
            options={checkInFrequencies.map(freq => ({
              value: freq,
              label: freq
            }))}
            icon={Calendar}
            required
          />
        </div>

        {/* Notes */}
        <div className="bg-neutral-50 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-neutral-900">Additional Notes</h3>
          
          <FormField
            id="notes"
            name="notes"
            label="Notes"
            value={formData.notes}
            onChange={onChange}
            multiline
            rows={4}
            placeholder="Add any additional notes about this contact..."
          />
        </div>
      </div>
    </div>
  );
}