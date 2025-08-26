import React from 'react';
import { Pagination } from '../src/components/ui';

export default {
  title: 'UI Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Pagination component for navigating through large sets of data. Essential for quiz lists, question banks, and results pages.',
      },
    },
  },
  argTypes: {
    currentPage: {
      control: 'number',
      description: 'Current active page',
    },
    totalPages: {
      control: 'number',
      description: 'Total number of pages',
    },
    totalItems: {
      control: 'number',
      description: 'Total number of items',
    },
    itemsPerPage: {
      control: 'number',
      description: 'Items displayed per page',
    },
    showPageSizeSelector: {
      control: 'boolean',
      description: 'Show page size selector',
    },
    showItemCount: {
      control: 'boolean',
      description: 'Show item count information',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'simple', 'compact'],
      description: 'Pagination style variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Pagination size',
    },
  },
};

const PaginationExample = ({ totalPages = 10, ...props }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  
  return (
    <Pagination 
      {...props}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  );
};

export const Default = () => (
  <PaginationExample totalPages={10} totalItems={100} itemsPerPage={10} />
);

export const Variants = () => (
  <div className="space-y-8">
    <div>
      <h3 className="text-sm font-medium mb-4">Default Pagination</h3>
      <PaginationExample 
        variant="default" 
        totalPages={8} 
        totalItems={80}
        itemsPerPage={10}
        showItemCount
      />
    </div>
    
    <div>
      <h3 className="text-sm font-medium mb-4">Simple Pagination</h3>
      <PaginationExample 
        variant="simple" 
        totalPages={8} 
        totalItems={80}
        itemsPerPage={10}
      />
    </div>
    
    <div>
      <h3 className="text-sm font-medium mb-4">Compact Pagination</h3>
      <PaginationExample 
        variant="compact" 
        totalPages={8} 
        totalItems={80}
        itemsPerPage={10}
      />
    </div>
  </div>
);

export const Sizes = () => (
  <div className="space-y-8">
    <div>
      <h3 className="text-sm font-medium mb-4">Small</h3>
      <PaginationExample size="sm" totalPages={5} />
    </div>
    
    <div>
      <h3 className="text-sm font-medium mb-4">Medium (Default)</h3>
      <PaginationExample size="md" totalPages={5} />
    </div>
    
    <div>
      <h3 className="text-sm font-medium mb-4">Large</h3>
      <PaginationExample size="lg" totalPages={5} />
    </div>
  </div>
);

export const WithPageSizeSelector = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  
  const totalItems = 247;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Total Items: {totalItems}
      </div>
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setItemsPerPage(newSize);
          setCurrentPage(1); // Reset to first page
        }}
        showPageSizeSelector
        showItemCount
      />
    </div>
  );
};

export const QuizPagination = () => (
  <div className="space-y-8 w-full max-w-4xl">
    <div>
      <h3 className="text-lg font-semibold mb-4">Quiz Question Navigation</h3>
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="text-center mb-4">
          <h4 className="font-medium">Question 5 of 20</h4>
          <p className="text-sm text-gray-600">What is the capital of France?</p>
        </div>
      </div>
      <PaginationExample 
        variant="simple" 
        totalPages={20} 
        size="sm"
      />
    </div>
    
    <div>
      <h3 className="text-lg font-semibold mb-4">Quiz Results List</h3>
      <div className="bg-white border rounded-lg p-4 mb-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 border-b">
            <span>Math Quiz - Chapter 1</span>
            <span className="text-green-600 font-medium">85%</span>
          </div>
          <div className="flex justify-between items-center p-3 border-b">
            <span>Science Quiz - Biology</span>
            <span className="text-green-600 font-medium">92%</span>
          </div>
          <div className="flex justify-between items-center p-3 border-b">
            <span>History Quiz - Ancient Rome</span>
            <span className="text-yellow-600 font-medium">78%</span>
          </div>
        </div>
      </div>
      <PaginationExample 
        totalPages={15} 
        totalItems={147}
        itemsPerPage={10}
        showItemCount
        showPageSizeSelector
      />
    </div>
    
    <div>
      <h3 className="text-lg font-semibold mb-4">Student List</h3>
      <div className="bg-white border rounded-lg p-4 mb-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 border-b">
            <div>
              <div className="font-medium">Alice Johnson</div>
              <div className="text-sm text-gray-600">alice.johnson@school.edu</div>
            </div>
            <span className="text-sm text-gray-500">Last active: 2 hours ago</span>
          </div>
          <div className="flex justify-between items-center p-3 border-b">
            <div>
              <div className="font-medium">Bob Smith</div>
              <div className="text-sm text-gray-600">bob.smith@school.edu</div>
            </div>
            <span className="text-sm text-gray-500">Last active: 1 day ago</span>
          </div>
          <div className="flex justify-between items-center p-3 border-b">
            <div>
              <div className="font-medium">Carol Davis</div>
              <div className="text-sm text-gray-600">carol.davis@school.edu</div>
            </div>
            <span className="text-sm text-gray-500">Last active: 3 days ago</span>
          </div>
        </div>
      </div>
      <PaginationExample 
        variant="compact"
        totalPages={25} 
        totalItems={245}
        itemsPerPage={10}
        showItemCount
      />
    </div>
  </div>
);

export const LargePagination = () => (
  <div className="space-y-4">
    <div className="text-sm text-gray-600">
      Large dataset with 10,000+ items
    </div>
    <PaginationExample 
      totalPages={500} 
      totalItems={10000}
      itemsPerPage={20}
      showItemCount
      showPageSizeSelector
    />
  </div>
);

export const Interactive = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Current Page: {currentPage}
      </div>
      <Pagination 
        currentPage={currentPage}
        totalPages={12}
        totalItems={120}
        itemsPerPage={10}
        onPageChange={setCurrentPage}
        showItemCount
        showPageSizeSelector
      />
    </div>
  );
};
