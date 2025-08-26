import React from 'react';
import { Tooltip } from '../src/components/ui';

export default {
  title: 'UI Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
};

export function Default() {
  return (
    <div className="flex justify-center p-12">
      <Tooltip content="This is a helpful tooltip" position="top">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Hover for tooltip
        </button>
      </Tooltip>
    </div>
  );
}

export function Positions() {
  return (
    <div className="grid grid-cols-2 gap-8 p-12">
      <Tooltip content="Top tooltip" position="top">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Top</button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" position="bottom">
        <button className="px-4 py-2 bg-green-500 text-white rounded-md">Bottom</button>
      </Tooltip>
      <Tooltip content="Left tooltip" position="left">
        <button className="px-4 py-2 bg-purple-500 text-white rounded-md">Left</button>
      </Tooltip>
      <Tooltip content="Right tooltip" position="right">
        <button className="px-4 py-2 bg-red-500 text-white rounded-md">Right</button>
      </Tooltip>
    </div>
  );
}

export function TriggerTypes() {
  return (
    <div className="flex gap-6 p-12">
      <Tooltip content="Hover trigger" trigger="hover">
        <span className="px-3 py-1 bg-gray-100 border rounded cursor-default">Hover me</span>
      </Tooltip>
      <Tooltip content="Focus trigger" trigger="focus">
        <input type="text" placeholder="Focus me" className="px-3 py-2 border rounded" />
      </Tooltip>
      <Tooltip content="Click trigger" trigger="click">
        <button className="px-4 py-2 bg-orange-500 text-white rounded">Click me</button>
      </Tooltip>
    </div>
  );
}

export function FormHelp() {
  return (
    <div className="max-w-md p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Username
          <Tooltip content="3-20 characters, alphanumeric only" position="right">
            <span className="ml-1 text-gray-400 cursor-help">ⓘ</span>
          </Tooltip>
        </label>
        <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter username" />
      </div>
    </div>
  );
}
