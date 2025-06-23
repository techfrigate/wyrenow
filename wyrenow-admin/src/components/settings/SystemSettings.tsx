import React, { useState } from 'react';
import { Save, Upload, Download } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DEFAULT_PV_RATES, CURRENCY_SYMBOLS } from '../../utils/constants';

export function SystemSettings() {
  const [pvRates, setPvRates] = useState(DEFAULT_PV_RATES);
  const [systemConfig, setSystemConfig] = useState({
    systemName: 'WyreNow MLM System',
    defaultCurrency: 'NGN',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  });

  const handlePvRateChange = (currency: string, rate: number) => {
    setPvRates(prev => ({ ...prev, [currency]: rate }));
  };

  const handleSystemConfigChange = (field: string, value: string) => {
    setSystemConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    // Save settings logic here
    console.log('Saving settings:', { pvRates, systemConfig });
  };

  const currencyOptions = Object.keys(CURRENCY_SYMBOLS).map(currency => ({
    value: currency,
    label: `${currency} (${CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS]})`
  }));

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  const timeFormatOptions = [
    { value: '12h', label: '12 Hour (AM/PM)' },
    { value: '24h', label: '24 Hour' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure global system settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PV Conversion Rates */}
        <Card title="PV Conversion Rates" subtitle="Set conversion rates for different currencies">
          <div className="space-y-4">
            {Object.entries(pvRates).map(([currency, rate]) => (
              <div key={currency} className="flex items-center space-x-4">
                <div className="w-16 text-sm font-medium text-gray-700">
                  {currency}
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    value={rate}
                    onChange={(e) => handlePvRateChange(currency, parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0.01"
                    placeholder="Rate"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  per PV
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <Button size="sm" onClick={handleSaveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save Rates
              </Button>
            </div>
          </div>
        </Card>

        {/* System Configuration */}
        <Card title="System Configuration" subtitle="General system preferences">
          <div className="space-y-4">
            <Input
              label="System Name"
              value={systemConfig.systemName}
              onChange={(e) => handleSystemConfigChange('systemName', e.target.value)}
            />

            <Select
              label="Default Currency"
              value={systemConfig.defaultCurrency}
              onChange={(e) => handleSystemConfigChange('defaultCurrency', e.target.value)}
              options={currencyOptions}
            />

            <Select
              label="Date Format"
              value={systemConfig.dateFormat}
              onChange={(e) => handleSystemConfigChange('dateFormat', e.target.value)}
              options={dateFormatOptions}
            />

            <Select
              label="Time Format"
              value={systemConfig.timeFormat}
              onChange={(e) => handleSystemConfigChange('timeFormat', e.target.value)}
              options={timeFormatOptions}
            />

            <div className="pt-4 border-t">
              <Button size="sm" onClick={handleSaveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card title="Data Management" subtitle="Import and export system data">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Import Data</h3>
              <p className="mt-1 text-sm text-gray-500">Upload CSV files to import packages or countries</p>
              <div className="mt-4 flex justify-center space-x-2">
                <Button size="sm" variant="secondary">
                  Import Packages
                </Button>
                <Button size="sm" variant="secondary">
                  Import Countries
                </Button>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-6 text-center">
              <Download className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Export Data</h3>
              <p className="mt-1 text-sm text-gray-500">Download your data as CSV files</p>
              <div className="mt-4 flex justify-center space-x-2">
                <Button size="sm" variant="secondary">
                  Export Packages
                </Button>
                <Button size="sm" variant="secondary">
                  Export Countries
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card title="Security Settings" subtitle="System security configuration">
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-800">Security Features</h4>
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                <li>• Session timeout: 2 hours</li>
                <li>• Password requirements: 8+ characters</li>
                <li>• Failed login lockout: 5 attempts</li>
                <li>• Audit logging: Enabled</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button size="sm" variant="secondary">
                View Audit Log
              </Button>
              <Button size="sm" variant="secondary">
                Security Report
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}