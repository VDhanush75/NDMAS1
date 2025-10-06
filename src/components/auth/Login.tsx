import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, UserCheck, ArrowLeft, Upload, User as UserIcon, MapPin, Bell, MessageSquare, Download, QrCode, KeyRound, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';
import { indianStates } from '../../data/locations';
import qrGenerator from 'qrcode-generator';

type View = 'roleSelection' | 'citizenSignup' | 'otpVerification' | 'permissionRequest' | 'qrCodeDisplay';

const roleSelectionSchema = yup.object().shape({
  role: yup.string().oneOf(['user', 'admin', 'rescue']).required('Please select a role'),
  adminLevel: yup.string().when('role', {
    is: 'admin',
    then: (schema) => schema.required('Please select an admin level'),
    otherwise: (schema) => schema.optional(),
  }),
  rescueLevel: yup.string().when('role', {
    is: 'rescue',
    then: (schema) => schema.oneOf(['team-leader', 'field-officer', 'resource-manager']).required('Please select your role'),
    otherwise: (schema) => schema.optional(),
  }),
  serviceId: yup.string().when('role', {
    is: 'rescue',
    then: (schema) => schema.required('Service ID is required'),
    otherwise: (schema) => schema.optional(),
  }),
  password: yup.string().when('role', {
    is: 'rescue',
    then: (schema) => schema.required('Password is required'),
    otherwise: (schema) => schema.optional(),
  }),
});

const signupSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  mobile: yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  state: yup.string().required('State is required'),
  district: yup.string().required('District is required'),
  area: yup.string().required('Area/Village is required'),
  photo: yup.mixed().optional(),
});

const otpSchema = yup.object().shape({
  otp: yup.string().matches(/^[0-9]{6}$/, 'OTP must be 6 digits').required('OTP is required'),
});

const Login: React.FC = () => {
  const { login } = useAuth();
  const [view, setView] = useState<View>('roleSelection');
  const [signupData, setSignupData] = useState<any>(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [finalizingUser, setFinalizingUser] = useState<Partial<User>>({});
  const [permissions, setPermissions] = useState({ location: true, sms: true, notifications: true });
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  const {
    register: registerRole,
    handleSubmit: handleRoleSubmit,
    watch: watchRole,
    formState: { errors: roleErrors }
  } = useForm({ resolver: yupResolver(roleSelectionSchema) });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    watch: watchSignup,
    formState: { errors: signupErrors }
  } = useForm({ resolver: yupResolver(signupSchema) });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors }
  } = useForm({ resolver: yupResolver(otpSchema) });

  const selectedRole = watchRole('role');
  const selectedState = watchSignup('state');

  const onRoleSelect = (data: any) => {
    if (data.role === 'user') {
      setView('citizenSignup');
    } else if (data.role === 'admin') {
      const user: User = {
        id: `admin_${data.adminLevel}_${Date.now()}`,
        mobile: '9876543210',
        email: `${data.adminLevel}@admin.example.com`,
        name: `${data.adminLevel.charAt(0).toUpperCase() + data.adminLevel.slice(1)} Admin`,
        role: 'admin',
        adminLevel: data.adminLevel,
        state: data.adminLevel === 'state' ? 'West Bengal' : undefined,
        district: data.adminLevel === 'district' ? 'Kolkata' : undefined,
        language: 'english',
        permissions: { location: true, sms: true, notifications: true }
      };
      login(user);
    } else if (data.role === 'rescue') {
      // Mock validation for rescue team credentials
      if (data.serviceId.toUpperCase() === 'RT123' && data.password === 'password123') {
        const user: User = {
          id: `rescue_${data.rescueLevel}_${Date.now()}`,
          mobile: '9876543211',
          email: `${data.rescueLevel}@rescue.example.com`,
          name: `Rescue ${data.rescueLevel.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}`,
          role: 'rescue',
          rescueLevel: data.rescueLevel,
          language: 'english',
          permissions: { location: true, sms: true, notifications: true }
        };
        login(user);
      } else {
        alert('Invalid Service ID or Password.');
      }
    }
  };

  const onSignup = (data: any) => {
    setSignupData(data);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    console.log(`[MOCK] OTP for ${data.mobile}: ${otp}`);
    alert(`An OTP has been sent to ${data.mobile}. For this demo, the OTP is: ${otp}`);
    setView('otpVerification');
  };

  const onOtpVerify = (data: any) => {
    if (data.otp === generatedOtp) {
      const partialUser: Partial<User> = {
        id: `user_${Date.now()}`,
        role: 'user',
        name: signupData.name,
        email: signupData.email,
        mobile: signupData.mobile,
        state: signupData.state,
        district: signupData.district,
        area: signupData.area,
        profilePhoto: photoPreview || undefined,
        language: 'english',
        aidStatus: 'Not Received',
      };
      setFinalizingUser(partialUser);
      setView('permissionRequest');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };
  
  const handlePermissionSubmit = () => {
    const userWithPermissions = {
        ...finalizingUser,
        permissions,
    };

    const qrData = JSON.stringify({
        id: userWithPermissions.id,
        name: userWithPermissions.name,
        mobile: userWithPermissions.mobile,
        location: `${userWithPermissions.area}, ${userWithPermissions.district}, ${userWithPermissions.state}`,
        aidStatus: userWithPermissions.aidStatus,
    });

    const qr = qrGenerator(0, 'M');
    qr.addData(qrData);
    qr.make();
    const dataUrl = qr.createDataURL(8, 8);
    setQrCodeDataUrl(dataUrl);

    setFinalizingUser({ ...userWithPermissions, qrCodeDataUrl: dataUrl });

    setView('qrCodeDisplay');
  };

  const handleFinishSignup = () => {
    login(finalizingUser as User);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 300 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -300 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  const renderRoleSelection = () => (
    <motion.div key="roleSelection" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <div className="text-center mb-8">
        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Flood Management System</h1>
        <p className="text-gray-600">Select Your Role</p>
      </div>
      <form onSubmit={handleRoleSubmit(onRoleSelect)}>
        <div className="space-y-3 mb-6">
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
            <input {...registerRole('role')} type="radio" value="user" className="mr-3" />
            <Users className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <div className="font-medium">Citizen User</div>
              <div className="text-sm text-gray-500">Report emergencies, receive alerts</div>
            </div>
          </label>
          
          <label className="flex flex-col p-3 border rounded-lg cursor-pointer hover:bg-green-50 has-[:checked]:bg-green-50 has-[:checked]:border-green-400 transition-all">
            <div className="flex items-center w-full">
                <input {...registerRole('role')} type="radio" value="rescue" className="mr-3" />
                <UserCheck className="w-5 h-5 text-green-600 mr-3" />
                <div className="flex-1">
                <div className="font-medium">Rescue Team</div>
                <div className="text-sm text-gray-500">Respond to emergencies</div>
                </div>
            </div>
            <AnimatePresence>
            {selectedRole === 'rescue' && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }} 
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full space-y-4 overflow-hidden"
              >
                <div>
                  <select {...registerRole('rescueLevel')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white">
                    <option value="">Select Your Role</option>
                    <option value="team-leader">Team Leader</option>
                    <option value="field-officer">Field Officer</option>
                    <option value="resource-manager">Resource Manager</option>
                  </select>
                  {roleErrors.rescueLevel && <p className="text-red-500 text-sm mt-1">{roleErrors.rescueLevel.message}</p>}
                </div>
                <div>
                  <div className="relative">
                    <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input {...registerRole('serviceId')} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Service ID" />
                  </div>
                  {roleErrors.serviceId && <p className="text-red-500 text-sm mt-1">{roleErrors.serviceId.message}</p>}
                </div>
                <div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input {...registerRole('password')} type="password" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Password" />
                  </div>
                  {roleErrors.password && <p className="text-red-500 text-sm mt-1">{roleErrors.password.message}</p>}
                </div>
                <p className="text-xs text-center text-gray-500">Demo Credentials - ID: <kbd className="font-mono">RT123</kbd>, Pass: <kbd className="font-mono">password123</kbd></p>
              </motion.div>
            )}
            </AnimatePresence>
          </label>

          <label className="flex flex-col p-3 border rounded-lg cursor-pointer hover:bg-red-50 has-[:checked]:bg-red-50 has-[:checked]:border-red-400 transition-all">
            <div className="flex items-center w-full">
                <input {...registerRole('role')} type="radio" value="admin" className="mr-3" />
                <Shield className="w-5 h-5 text-red-600 mr-3" />
                <div className="flex-1">
                <div className="font-medium">Admin Authority</div>
                <div className="text-sm text-gray-500">Manage operations</div>
                </div>
            </div>
            <AnimatePresence>
            {selectedRole === 'admin' && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }} 
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full overflow-hidden"
              >
                <select {...registerRole('adminLevel')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white">
                  <option value="">Select Admin Level</option>
                  <option value="central">Central Authority</option>
                  <option value="state">State Authority</option>
                  <option value="district">District Authority</option>
                </select>
                {roleErrors.adminLevel && <p className="text-red-500 text-sm mt-1">{roleErrors.adminLevel.message}</p>}
              </motion.div>
            )}
            </AnimatePresence>
          </label>
        </div>
        {roleErrors.role && <p className="text-red-500 text-sm mb-2">{roleErrors.role.message}</p>}
        
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          {selectedRole === 'user' ? 'Proceed to Sign Up' : 'Access Dashboard'}
        </button>
      </form>
    </motion.div>
  );

  const renderCitizenSignup = () => (
    <motion.div key="citizenSignup" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <button onClick={() => setView('roleSelection')} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Role Selection
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Citizen Sign Up</h2>
      <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
            {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : <UserIcon className="w-12 h-12 text-gray-400" />}
          </div>
          <label className="flex-1 cursor-pointer bg-white border border-gray-300 rounded-lg p-3 text-center hover:bg-gray-50">
            <Upload className="w-5 h-5 mx-auto text-gray-500" />
            <span className="text-sm text-gray-600">Upload Photo</span>
            <input type="file" {...registerSignup('photo')} onChange={handlePhotoChange} className="hidden" accept="image/*" />
          </label>
        </div>
        <input {...registerSignup('name')} placeholder="Full Name" className="w-full px-4 py-3 border rounded-lg" />
        {signupErrors.name && <p className="text-red-500 text-sm">{signupErrors.name.message}</p>}
        <input {...registerSignup('email')} placeholder="Email ID" className="w-full px-4 py-3 border rounded-lg" />
        {signupErrors.email && <p className="text-red-500 text-sm">{signupErrors.email.message}</p>}
        <input {...registerSignup('mobile')} placeholder="10-digit Mobile Number" className="w-full px-4 py-3 border rounded-lg" />
        {signupErrors.mobile && <p className="text-red-500 text-sm">{signupErrors.mobile.message}</p>}
        <input {...registerSignup('password')} type="password" placeholder="Password" className="w-full px-4 py-3 border rounded-lg" />
        {signupErrors.password && <p className="text-red-500 text-sm">{signupErrors.password.message}</p>}
        <select {...registerSignup('state')} className="w-full px-4 py-3 border rounded-lg bg-white">
          <option value="">Select State</option>
          {Object.keys(indianStates).map(state => <option key={state} value={state}>{state}</option>)}
        </select>
        {signupErrors.state && <p className="text-red-500 text-sm">{signupErrors.state.message}</p>}
        <select {...registerSignup('district')} disabled={!selectedState} className="w-full px-4 py-3 border rounded-lg bg-white disabled:bg-gray-100">
          <option value="">Select District</option>
          {selectedState && indianStates[selectedState]?.map(district => <option key={district} value={district}>{district}</option>)}
        </select>
        {signupErrors.district && <p className="text-red-500 text-sm">{signupErrors.district.message}</p>}
        <input {...registerSignup('area')} placeholder="Village / Urban Area" className="w-full px-4 py-3 border rounded-lg" />
        {signupErrors.area && <p className="text-red-500 text-sm">{signupErrors.area.message}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">Get OTP</button>
      </form>
    </motion.div>
  );

  const renderOtpVerification = () => (
    <motion.div key="otpVerification" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <button onClick={() => setView('citizenSignup')} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sign Up
      </button>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Number</h2>
        <p className="text-gray-600 mb-6">Enter the 6-digit OTP sent to {signupData?.mobile}</p>
        <form onSubmit={handleOtpSubmit(onOtpVerify)}>
          <input
            {...registerOtp('otp')}
            maxLength={6}
            placeholder="______"
            className="w-full text-center text-3xl tracking-[1em] font-mono bg-gray-100 border-2 border-gray-300 rounded-lg p-4 focus:ring-blue-500 focus:border-blue-500"
          />
          {otpErrors.otp && <p className="text-red-500 text-sm mt-2">{otpErrors.otp.message}</p>}
          <button type="submit" className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700">Verify & Proceed</button>
        </form>
        <button className="text-sm text-blue-600 mt-4 hover:underline">Resend OTP</button>
      </div>
    </motion.div>
  );

  const renderPermissionRequest = () => (
    <motion.div key="permissionRequest" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">One Last Step</h2>
        <p className="text-gray-600 mb-6">To provide the best emergency service, we need a few permissions.</p>
        <div className="space-y-4 mb-8">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                <MapPin className="w-6 h-6 text-blue-600 mr-4"/>
                <div>
                    <div className="font-medium">Location Access</div>
                    <div className="text-sm text-gray-500">For accurate SOS and rescue operations.</div>
                </div>
                <input type="checkbox" checked={permissions.location} onChange={e => setPermissions(p => ({...p, location: e.target.checked}))} className="ml-auto h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"/>
            </label>
            <label className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                <MessageSquare className="w-6 h-6 text-green-600 mr-4"/>
                <div>
                    <div className="font-medium">SMS Alerts</div>
                    <div className="text-sm text-gray-500">Receive critical warnings even without internet.</div>
                </div>
                <input type="checkbox" checked={permissions.sms} onChange={e => setPermissions(p => ({...p, sms: e.target.checked}))} className="ml-auto h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"/>
            </label>
            <label className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                <Bell className="w-6 h-6 text-red-600 mr-4"/>
                <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-gray-500">Get instant real-time alerts and updates.</div>
                </div>
                <input type="checkbox" checked={permissions.notifications} onChange={e => setPermissions(p => ({...p, notifications: e.target.checked}))} className="ml-auto h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500"/>
            </label>
        </div>
        <button onClick={handlePermissionSubmit} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">Grant & Create My ID</button>
    </motion.div>
  );

  const renderQrCodeDisplay = () => (
    <motion.div key="qrCodeDisplay" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Digital Relief ID is Ready!</h2>
            <p className="text-gray-600 mb-6">Show this QR code at relief camps for quick identification and aid distribution.</p>
            <div className="p-4 bg-gray-100 rounded-lg inline-block border">
                <img src={qrCodeDataUrl} alt="Your Relief QR Code" className="w-56 h-56" />
            </div>
            <div className="mt-6 space-y-4">
                <a href={qrCodeDataUrl} download={`FloodRelief_QR_${finalizingUser.id}.png`} className="w-full bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-800 flex items-center justify-center">
                    <Download className="w-5 h-5 mr-2" /> Download QR Code
                </a>
                <button onClick={handleFinishSignup} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700">Finish & Go to Dashboard</button>
            </div>
        </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'roleSelection' && renderRoleSelection()}
          {view === 'citizenSignup' && renderCitizenSignup()}
          {view === 'otpVerification' && renderOtpVerification()}
          {view === 'permissionRequest' && renderPermissionRequest()}
          {view === 'qrCodeDisplay' && renderQrCodeDisplay()}
        </AnimatePresence>
        <div className="mt-6 text-center text-sm text-gray-500">
          Emergency Hotline: <span className="font-semibold text-red-600">1078</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
