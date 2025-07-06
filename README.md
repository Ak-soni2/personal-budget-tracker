# Personal Finance Visualizer

A modern, production-ready personal finance web application with advanced data visualization, transaction management, and budget tracking capabilities.

## Features

- **Interactive Dashboard**: Beautiful glassmorphism UI with real-time financial insights
- **Transaction Management**: Complete CRUD operations for income and expenses
- **Data Visualization**: Multiple chart types (bar, pie, radar) using Recharts
- **Budget Tracking**: Set and monitor budgets with visual progress indicators
- **Responsive Design**: Mobile-first approach with seamless cross-device experience
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Export Functionality**: CSV export for all transactions
- **Advanced Filtering**: Filter transactions by date, category, and type

## Tech Stack

### Frontend
- **Next.js 13** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom glassmorphism effects
- **shadcn/ui** - High-quality component library
- **Recharts** - Data visualization
- **React Query** - Data fetching and state management
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB installation)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-finance-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-finance?retryWrites=true&w=majority
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Transaction Model
```typescript
{
  amount: Number,
  date: Date,
  description: String,
  category: String,
  type: 'income' | 'expense',
  createdAt: Date,
  updatedAt: Date
}
```

### Budget Model
```typescript
{
  category: String,
  budgetAmount: Number,
  month: Number,
  year: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions with optional filters
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Budgets
- `GET /api/budgets` - Get budgets with optional filters
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/[id]` - Update budget

### Dashboard
- `GET /api/dashboard` - Get dashboard analytics data

## Features in Detail

### Dashboard Analytics
- Monthly income, expenses, and net savings
- Top spending categories
- Recent transactions
- 6-month expense trends
- Budget vs actual comparison
- Category breakdown charts

### Transaction Management
- Add/edit/delete transactions
- Form validation with error handling
- Category-based organization
- Date range filtering
- Export to CSV

### Budget Tracking
- Set monthly budgets by category
- Visual progress indicators
- Budget vs actual comparisons
- Radar chart visualization

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Build
```bash
npm run build
npm start
```

## Project Structure

```
/app
  layout.tsx           # Root layout with React Query
  page.tsx            # Landing page
  globals.css         # Global styles with glassmorphism
  /dashboard
    page.tsx          # Dashboard page
    /components       # Dashboard components
  /transactions
    page.tsx          # Transaction management
    /components       # Transaction components
  /api               # API routes
/components/ui       # shadcn/ui components
/hooks              # Custom React hooks
/lib                # Utility functions
/models             # Mongoose models
/types              # TypeScript type definitions
```

## Development Workflow

1. **Data Layer**: Models and API routes
2. **Business Logic**: Custom hooks with React Query
3. **UI Components**: Reusable components with shadcn/ui
4. **Pages**: Compose components into full pages
5. **Styling**: Tailwind CSS with custom glassmorphism effects

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.