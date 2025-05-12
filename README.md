# Insurance Brokerage Frontend 2025

A modern insurance brokerage management system built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Manager Dashboard
- Client Management
  - Add/Edit/Delete clients
  - Search and filter clients
  - Assign clients to sales reps
  - View client details and policies
- Sales Rep Management
  - Monitor sales rep performance
  - View assigned clients
  - Track policy sales

### Underwriter Dashboard
- Policy Management
  - Create new insurance policies
  - Edit existing policies
  - Archive policies
  - Search and filter policies
- Policy Types
  - Life Insurance
  - Health Insurance
  - Vehicle Insurance

### Sales Rep Dashboard
- Client Management
  - View assigned clients
  - Add new clients
  - Track client policies
- Policy Management
  - View available policies
  - Create policy applications
  - Track policy status

## 🔗 URLs

### Manager Dashboard
- Main Dashboard: `/manager-dashboard`
- Client Management: `/manager-dashboard/clients`
- Sales Rep Management: `/manager-dashboard/sales-reps`

### Underwriter Dashboard
- Main Dashboard: `/underwriter-dashboard`
- Policy Management: `/underwriter-dashboard/policies`

### Sales Rep Dashboard
- Main Dashboard: `/sales-rep-dashboard`
- Client Management: `/sales-rep-dashboard/clients`
- Policy Applications: `/sales-rep-dashboard/policies`

## 🛠️ Technical Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **State Management**: React Hooks
- **Form Handling**: React Forms
- **Authentication**: NextAuth.js (to be implemented)
- **API Integration**: REST API (to be implemented)

## 📦 Project Structure

```
src/
├── app/
│   ├── (manager)/
│   │   └── manager-dashboard/
│   ├── (underwriter)/
│   │   └── underwriter-dashboard/
│   └── (sales-rep)/
│       └── sales-rep-dashboard/
├── components/
│   ├── ui/
│   └── shared/
└── lib/
    └── utils/
```

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/insurance-brokerage-frontend.git
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=your_api_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

## 📝 Development Guidelines

1. **Code Style**
   - Use TypeScript for type safety
   - Follow ESLint rules
   - Use Prettier for formatting

2. **Component Structure**
   - Use functional components
   - Implement proper TypeScript interfaces
   - Follow atomic design principles

3. **State Management**
   - Use React hooks for local state
   - Implement proper error handling
   - Add loading states

4. **Styling**
   - Use Tailwind CSS classes
   - Follow mobile-first approach
   - Maintain consistent spacing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
