import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if dummy user already exists
    const existingUser = await User.findOne({ email: 'demo@example.com' });
    if (existingUser) {
      return NextResponse.json({ 
        message: 'Dummy user already exists',
        user: {
          id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name
        }
      });
    }
    
    // Create dummy user
    const dummyUser = new User({
      email: 'demo@example.com',
      name: 'Demo User',
      password: 'demo123456' // In a real app, this would be hashed
    });
    
    await dummyUser.save();
    
    return NextResponse.json({ 
      message: 'Dummy user created successfully',
      user: {
        id: dummyUser._id,
        email: dummyUser.email,
        name: dummyUser.name
      }
    });
  } catch (error) {
    console.error('Error creating dummy user:', error);
    return NextResponse.json({ error: 'Failed to create dummy user' }, { status: 500 });
  }
} 