import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, UserCheck, ArrowLeft, Upload, User as UserIcon, MapPin, Bell, MessageSquare, Download, QrCode, KeyRound, ShieldAlert, Handshake, LogIn, LoaderCircle, Smartphone } from 'lucide-react';
import { User, NgoData } from '../../types';
import { indianStates } from '../../data/locations';
import qrGenerator from 'qrcode-generator';
import { useTranslation } from 'react-i18next';

type View = 'roleSelection' | 'userAuth' | 'otpVerification' | 'permissionRequest' | 'qrCodeDisplay';

interface RoleFormData {
  role: 'user' | 'admin' | 'rescue' | 'ngo';
  adminLevel?: 'NDMA' | 'SDMA' | 'DDMA';
  rescueLevel?: 'team-leader' | 'field-officer' | 'resource-manager';
  serviceId?: string;
  password?: string;
  ngoId?: string;
  ngoLevel?: 'admin' | 'volunteer';
  state?: string;
}

const roleSelectionSchema = yup.object().shape({
  role: yup.string().oneOf(['user', 'admin', 'rescue', 'ngo']).required('Please select a role'),
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
    is: (val: string) => ['admin', 'rescue'].includes(val),
    then: (schema) => schema.required('Service ID is required'),
    otherwise: (schema) => schema.optional(),
  }),
  password: yup.string().when('role', {
    is: (val: string) => ['admin', 'rescue', 'ngo'].includes(val),
    then: (schema) => schema.required('Password is required'),
    otherwise: (schema) => schema.optional(),
  }),
  ngoId: yup.string().when('role', {
    is: 'ngo',
    then: (schema) => schema.required('NGO ID is required'),
    otherwise: (schema) => schema.optional(),
  }),
  ngoLevel: yup.string().when('role', {
    is: 'ngo',
    then: (schema) => schema.oneOf(['admin', 'volunteer']).required('Please select your role'),
    otherwise: (schema) => schema.optional(),
  }),
  state: yup.string().when('role', {
    is: 'ngo',
    then: (schema) => schema.required('Please select your state'),
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

const otpSignupSchema = yup.object().shape({
    mobile: yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
});

const userLoginSchema = yup.object().shape({
    username: yup.string().required('Mobile number or Email is required'),
    password: yup.string().required('Password is required'),
});

const otpSchema = yup.object().shape({
  otp: yup.string().matches(/^[0-9]{6}$/, 'OTP must be 6 digits').required('OTP is required'),
});

interface LoginProps {
  setGeneralUsers: React.Dispatch<React.SetStateAction<User[]>>;
  adminUsers: User[];
  rescueUsers: User[];
  ngoData: NgoData[];
  generalUsers: User[];
  login: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setGeneralUsers, adminUsers, rescueUsers, ngoData, generalUsers, login }) => {
  const { t } = useTranslation();
  const [view, setView] = useState<View>('roleSelection');
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otpSignup'>('login');
  const [signupData, setSignupData] = useState<any>(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [finalizingUser, setFinalizingUser] = useState<Partial<User>>({});
  const [permissions, setPermissions] = useState({ location: true, sms: true, notifications: true });
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register: registerRole,
    handleSubmit: handleRoleSubmit,
    watch: watchRole,
    formState: { errors: roleErrors }
  } = useForm<RoleFormData>({ defaultValues: { role: 'user' } });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    watch: watchSignup,
    formState: { errors: signupErrors }
  } = useForm({ resolver: yupResolver(signupSchema) });
  
  const {
    register: registerUserLogin,
    handleSubmit: handleUserLoginSubmit,
    formState: { errors: userLoginErrors }
  } = useForm({ resolver: yupResolver(userLoginSchema) });

  const {
    register: registerOtpSignup,
    handleSubmit: handleOtpSignupSubmit,
    formState: { errors: otpSignupErrors }
  } = useForm({ resolver: yupResolver(otpSignupSchema) });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors }
  } = useForm({ resolver: yupResolver(otpSchema) });

  const selectedRole = watchRole('role');
  const selectedState = watchSignup('state');

  const onRoleSelect: SubmitHandler<RoleFormData> = (data) => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      if (data.role === 'user') {
        setView('userAuth');
        return;
      }

      let authUser: User | undefined;
      if (data.role === 'admin') {
        authUser = adminUsers.find(u => u.serviceId === data.serviceId && u.password === data.password && u.adminLevel === data.adminLevel);
        if (authUser) {
            login(authUser);
        } else {
            setError('Invalid credentials or mismatched admin level.');
        }
      } else if (data.role === 'rescue') {
        authUser = rescueUsers.find(u => u.serviceId === data.serviceId && u.password === data.password && u.rescueLevel === data.rescueLevel);
         if (authUser) {
            login(authUser);
        } else {
            setError('Invalid credentials or mismatched rescue role.');
        }
      } else if (data.role === 'ngo') {
        const ngo = ngoData.find(n => n.registrationId === data.ngoId && n.state === data.state && n.status === 'Approved');
        if (ngo && data.password === 'password123') { // Simplified password check
            authUser = {
                id: `ngo_${data.ngoLevel}_${data.ngoId}`,
                name: `${ngo.name} ${data.ngoLevel === 'admin' ? 'Coordinator' : 'Volunteer'}`,
                email: `${data.ngoLevel}@${ngo.name.replace(/\s+/g, '').toLowerCase()}.org`,
                role: 'ngo',
                ngoLevel: data.ngoLevel as 'admin' | 'volunteer',
                ngoId: data.ngoId,
                state: data.state,
                mobile: '9876543212', // Placeholder
                password: 'password123',
                language: 'en',
                permissions: { location: true, sms: true, notifications: true }
            };
            login(authUser);
        } else {
            setError('Invalid credentials, or NGO not approved for this state.');
        }
      }
    }, 500);
  };

  const onUserLogin = (data: any) => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      const user = generalUsers.find(u => (u.email === data.username || u.mobile === data.username) && u.password === data.password);
      if (user) {
        login(user);
      } else {
          setError('Invalid username or password.');
      }
    }, 1000);
  };

  const onSignup = (data: any) => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      setSignupData(data);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      alert(`An OTP has been sent to ${data.mobile}. For this demo, the OTP is: ${otp}`);
      setView('otpVerification');
    }, 1000);
  };

  const onOtpSignup = (data: any) => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      setSignupData(data); // only mobile is available
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      alert(`An OTP has been sent to ${data.mobile}. For this demo, the OTP is: ${otp}`);
      setView('otpVerification');
    }, 1000);
  };

  const onOtpVerify = (data: any) => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      if (data.otp === generatedOtp) {
        const partialUser: Partial<User> = {
          id: `user_${Date.now()}`,
          role: 'user',
          name: signupData.name || `User ${signupData.mobile.slice(-4)}`,
          email: signupData.email || `${signupData.mobile}@flood-relief.in`,
          mobile: signupData.mobile,
          password: signupData.password || 'password123', // Default password for OTP signup
          state: signupData.state,
          district: signupData.district,
          area: signupData.area,
          profilePhoto: photoPreview || undefined,
          language: 'en',
          aidStatus: 'Not Received',
        };
        setFinalizingUser(partialUser);
        setView('permissionRequest');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    }, 1000);
  };
  
  const handlePermissionSubmit = () => {
    const userWithPermissions = { ...finalizingUser, permissions };
    const qrData = JSON.stringify({
        id: userWithPermissions.id, name: userWithPermissions.name, mobile: userWithPermissions.mobile,
        location: `${userWithPermissions.area}, ${userWithPermissions.district}, ${userWithPermissions.state}`,
        aidStatus: userWithPermissions.aidStatus,
    });
    const qr = qrGenerator(0, 'M');
    qr.addData(qrData);
    qr.make();
    const dataUrl = qr.createDataURL(4, 4);
    
    const finalUser = { ...userWithPermissions, qrCodeDataUrl: dataUrl } as User;
    setFinalizingUser(finalUser);
    setGeneralUsers(prev => [...prev, finalUser]); // Add new user to the list
    setView('qrCodeDisplay');
  };

  const handleFinishSignup = () => {
    login(finalizingUser as User);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => { setPhotoPreview(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 300 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -300 },
  };
  const pageTransition = { type: 'spring', stiffness: 300, damping: 30 };

  const renderRoleSelection = () => (
    <motion.div key="roleSelection" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <div className="text-center mb-6">
        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('login_title')}</h1>
        <p className="text-gray-600">{t('select_role')}</p>
      </div>
      <form onSubmit={handleRoleSubmit(onRoleSelect)} className="space-y-4">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
        
        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
          <input {...registerRole('role')} type="radio" value="user" className="mr-3" />
          <Users className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <div className="font-medium">{t('user')}</div>
            <div className="text-sm text-gray-500">{t('citizen_user_desc')}</div>
          </div>
        </label>
        
        <label className="flex flex-col p-3 border rounded-lg cursor-pointer hover:bg-green-50 has-[:checked]:bg-green-50 has-[:checked]:border-green-400 transition-all">
          <div className="flex items-center w-full">
              <input {...registerRole('role')} type="radio" value="rescue" className="mr-3" />
              <UserCheck className="w-5 h-5 text-green-600 mr-3" />
              <div className="flex-1">
                <div className="font-medium">{t('rescue_team')}</div>
                <div className="text-sm text-gray-500">{t('rescue_team_desc')}</div>
              </div>
          </div>
          <AnimatePresence>
          {selectedRole === 'rescue' && (
            <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full space-y-4 overflow-hidden">
              <select {...registerRole('rescueLevel')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white">
                <option value="">Select Your Role</option>
                <option value="team-leader">Team Leader</option>
                <option value="field-officer">Field Officer</option>
                <option value="resource-manager">Resource Manager</option>
              </select>
              {roleErrors.rescueLevel && <p className="text-red-500 text-sm mt-1">{roleErrors.rescueLevel?.message}</p>}
              <div className="relative"><ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input {...registerRole('serviceId')} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Service ID" /></div>
              {roleErrors.serviceId && <p className="text-red-500 text-sm mt-1">{roleErrors.serviceId?.message}</p>}
              <div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input {...registerRole('password')} type="password" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Password" /></div>
              {roleErrors.password && <p className="text-red-500 text-sm mt-1">{roleErrors.password?.message}</p>}
              <div className="text-xs text-center text-gray-500 space-y-1">
                  <p>Pass for all: <kbd className="font-mono">password123</kbd></p>
                  <p>Team Leader (Kolkata): ID <kbd className="font-mono">RT001</kbd></p>
                  <p>Team Leader (Kamrup): ID <kbd className="font-mono">RT002</kbd></p>
                  <p>Team Leader (Howrah): ID <kbd className="font-mono">RT003</kbd></p>
                  <p>Field Officer (Kolkata): ID <kbd className="font-mono">RT-FO-001</kbd></p>
                  <p>Resource Manager (Kolkata): ID <kbd className="font-mono">RT-RM-001</kbd></p>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </label>

        <label className="flex flex-col p-3 border rounded-lg cursor-pointer hover:bg-yellow-50 has-[:checked]:bg-yellow-50 has-[:checked]:border-yellow-400 transition-all">
          <div className="flex items-center w-full">
            <input {...registerRole('role')} type="radio" value="ngo" className="mr-3" />
            <Handshake className="w-5 h-5 text-yellow-600 mr-3" />
            <div className="flex-1">
              <div className="font-medium">{t('ngo_dashboard')}</div>
              <div className="text-sm text-gray-500">{t('ngo_dashboard_desc')}</div>
            </div>
          </div>
          <AnimatePresence>
          {selectedRole === 'ngo' && (
            <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full space-y-4 overflow-hidden">
              <select {...registerRole('ngoLevel')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white">
                <option value="">Select Your Role</option>
                <option value="admin">Coordinator / Admin</option>
                <option value="volunteer">Relief Volunteer</option>
              </select>
              {roleErrors.ngoLevel && <p className="text-red-500 text-sm mt-1">{roleErrors.ngoLevel?.message}</p>}
               <select {...registerRole('state')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white">
                <option value="">Select Your State</option>
                {Object.keys(indianStates).map(state => <option key={state} value={state}>{state}</option>)}
              </select>
              {roleErrors.state && <p className="text-red-500 text-sm mt-1">{roleErrors.state?.message as string}</p>}
              <div className="relative"><ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input {...registerRole('ngoId')} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" placeholder="NGO ID" /></div>
              {roleErrors.ngoId && <p className="text-red-500 text-sm mt-1">{roleErrors.ngoId?.message}</p>}
              <div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input {...registerRole('password')} type="password" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" placeholder="Password" /></div>
              {roleErrors.password && <p className="text-red-500 text-sm mt-1">{roleErrors.password?.message}</p>}
              <div className="text-xs text-center text-gray-500 space-y-1">
                  <p>Pass for all: <kbd className="font-mono">password123</kbd></p>
                  <p>West Bengal NGO: ID <kbd className="font-mono">NGO123</kbd> (Select WB)</p>
                  <p>Assam NGO: ID <kbd className="font-mono">NGO456</kbd> (Select Assam)</p>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </label>

        <label className="flex flex-col p-3 border rounded-lg cursor-pointer hover:bg-red-50 has-[:checked]:bg-red-50 has-[:checked]:border-red-400 transition-all">
          <div className="flex items-center w-full">
              <input {...registerRole('role')} type="radio" value="admin" className="mr-3" />
              <Shield className="w-5 h-5 text-red-600 mr-3" />
              <div className="flex-1">
              <div className="font-medium">{t('admin_authority')}</div>
              <div className="text-sm text-gray-500">{t('admin_authority_desc')}</div>
              </div>
          </div>
          <AnimatePresence>
          {selectedRole === 'admin' && (
            <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full space-y-4 overflow-hidden">
              <select {...registerRole('adminLevel')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white">
                <option value="">Select Admin Level</option>
                <option value="NDMA">NDMA</option>
                <option value="SDMA">SDMA</option>
                <option value="DDMA">DDMA</option>
              </select>
              {roleErrors.adminLevel && <p className="text-red-500 text-sm mt-1">{roleErrors.adminLevel?.message}</p>}
              <div className="relative"><ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input {...registerRole('serviceId')} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" placeholder="Service ID" /></div>
              {roleErrors.serviceId && <p className="text-red-500 text-sm mt-1">{roleErrors.serviceId?.message}</p>}
              <div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input {...registerRole('password')} type="password" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" placeholder="Password" /></div>
              {roleErrors.password && <p className="text-red-500 text-sm mt-1">{roleErrors.password?.message}</p>}
              <div className="text-xs text-center text-gray-500 space-y-1">
                  <p>Pass for all: <kbd className="font-mono">password123</kbd></p>
                  <p>NDMA: ID <kbd className="font-mono">NDMA1</kbd></p>
                  <p>SDMA (WB): ID <kbd className="font-mono">SDMA1</kbd></p>
                  <p>SDMA (Assam): ID <kbd className="font-mono">SDMA2</kbd></p>
                  <p>DDMA (Kolkata): ID <kbd className="font-mono">DDMA1</kbd></p>
                  <p>DDMA (Howrah): ID <kbd className="font-mono">DDMA2</kbd></p>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </label>
        
        <button type="submit" disabled={isLoading || !selectedRole} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center">
          {isLoading ? <LoaderCircle className="animate-spin w-5 h-5 mr-2" /> : null}
          {selectedRole === 'user' ? t('proceed') : t('access_dashboard')}
        </button>
      </form>
    </motion.div>
  );

  const renderUserAuth = () => (
    <motion.div key="userAuth" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <button onClick={() => { setView('roleSelection'); setError(null); }} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> {t('back_to_role_selection')}
      </button>
      <div className="flex border-b mb-4">
        <button onClick={() => { setAuthMode('login'); setError(null); }} className={`flex-1 py-2 font-medium ${authMode === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>{t('log_in')}</button>
        <button onClick={() => { setAuthMode('signup'); setError(null); }} className={`flex-1 py-2 font-medium ${authMode === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>{t('create_new_account')}</button>
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      <AnimatePresence mode="wait">
        {authMode === 'login' && renderUserLogin()}
        {authMode === 'signup' && renderUserSignup()}
        {authMode === 'otpSignup' && renderOtpSignup()}
      </AnimatePresence>
    </motion.div>
  );

  const renderUserLogin = () => (
    <motion.div key="userLogin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('citizen_login_title')}</h2>
      <p className="text-xs text-center text-gray-500 mb-4">{t('citizen_login_demo')}</p>
      <form onSubmit={handleUserLoginSubmit(onUserLogin)} className="space-y-4">
        <input {...registerUserLogin('username')} placeholder={t('mobile_or_email_placeholder')} className="w-full px-4 py-3 border rounded-lg" />
        {userLoginErrors.username && <p className="text-red-500 text-sm">{userLoginErrors.username?.message}</p>}
        <input {...registerUserLogin('password')} type="password" placeholder={t('password_placeholder')} className="w-full px-4 py-3 border rounded-lg" />
        {userLoginErrors.password && <p className="text-red-500 text-sm">{userLoginErrors.password?.message}</p>}
        <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2">{t('remember_me')}</span>
            </label>
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">{t('forgot_password')}</a>
        </div>
        <div className="flex items-center">
            <input type="checkbox" id="location-permission" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="location-permission" className="ml-2 block text-sm text-gray-700">{t('allow_permissions')}</label>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center">
            {isLoading ? <LoaderCircle className="animate-spin w-5 h-5 mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
            {t('log_in')}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        {t('no_account')}{' '}
        <button onClick={() => setAuthMode('signup')} className="font-medium text-blue-600 hover:text-blue-500">
          {t('create_new_account')}
        </button>
      </p>
    </motion.div>
  );

  const renderUserSignup = () => (
    <motion.div key="userSignup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('create_new_account')}</h2>
      <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
            {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : <UserIcon className="w-12 h-12 text-gray-400" />}
          </div>
          <label className="flex-1 cursor-pointer bg-white border border-gray-300 rounded-lg p-3 text-center hover:bg-gray-50">
            <Upload className="w-5 h-5 mx-auto text-gray-500" />
            <span className="text-sm text-gray-600">{t('upload_photo')}</span>
            <input type="file" {...registerSignup('photo')} onChange={handlePhotoChange} className="hidden" accept="image/*" />
          </label>
        </div>
        <input {...registerSignup('name')} placeholder={t('full_name_placeholder')} className="w-full px-4 py-3 border rounded-lg" />
        {signupErrors.name && <p className="text-red-500 text-sm">{signupErrors.name?.message}</p>}
        <input {...registerSignup('email')} placeholder={t('email_placeholder')} className="w-full px-4 py-3 border rounded-lg" />
        {signupErrors.email && <p className="text-red-500 text-sm">{signupErrors.email?.message}</p>}
        <input {...registerSignup('mobile')} placeholder={t('mobile_number_placeholder')} className="w-full px-4 py-3 border rounded-lg" />
        {signupErrors.mobile && <p className="text-red-500 text-sm">{signupErrors.mobile?.message}</p>}
        <input {...registerSignup('password')} type="password" placeholder={t('password_placeholder')} className="w-full px-4 py-3 border rounded-lg" />
        {signupErrors.password && <p className="text-red-500 text-sm">{signupErrors.password?.message}</p>}
        <select {...registerSignup('state')} className="w-full px-4 py-3 border rounded-lg bg-white">
          <option value="">{t('select_state')}</option>
          {Object.keys(indianStates).map(state => <option key={state} value={state}>{state}</option>)}
        </select>
        {signupErrors.state && <p className="text-red-500 text-sm">{signupErrors.state?.message}</p>}
        <select {...registerSignup('district')} disabled={!selectedState} className="w-full px-4 py-3 border rounded-lg bg-white disabled:bg-gray-100">
          <option value="">{t('select_district')}</option>
          {selectedState && indianStates[selectedState]?.map(district => <option key={district} value={district}>{district}</option>)}
        </select>
        {signupErrors.district && <p className="text-red-500 text-sm">{signupErrors.district?.message}</p>}
        <input {...registerSignup('area')} placeholder={t('area_village_placeholder')} className="w-full px-4 py-3 border rounded-lg" />
        {signupErrors.area && <p className="text-red-500 text-sm">{signupErrors.area?.message}</p>}
        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center">
            {isLoading ? <LoaderCircle className="animate-spin w-5 h-5 mr-2" /> : null}
            {t('get_otp')}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button onClick={() => setAuthMode('otpSignup')} className="text-sm text-blue-600 hover:underline">{t('or_signup_with')}</button>
      </div>
    </motion.div>
  );

  const renderOtpSignup = () => (
    <motion.div key="otpSignup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('signup_otp_title')}</h2>
        <p className="text-gray-600 mb-6">{t('signup_otp_desc')}</p>
        <form onSubmit={handleOtpSignupSubmit(onOtpSignup)} className="space-y-4">
            <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input {...registerOtpSignup('mobile')} placeholder={t('mobile_number_placeholder')} className="w-full pl-10 pr-4 py-3 border rounded-lg" />
            </div>
            {otpSignupErrors.mobile && <p className="text-red-500 text-sm">{otpSignupErrors.mobile?.message}</p>}
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center">
                {isLoading ? <LoaderCircle className="animate-spin w-5 h-5 mr-2" /> : null}
                {t('get_otp')}
            </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
            {t('already_have_account')}{' '}
            <button onClick={() => setAuthMode('login')} className="font-medium text-blue-600 hover:text-blue-500">
                {t('log_in')}
            </button>
        </p>
    </motion.div>
  );

  const renderOtpVerification = () => (
    <motion.div key="otpVerification" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <button onClick={() => setView('userAuth')} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('verify_otp_title')}</h2>
        <p className="text-gray-600 mb-6">{t('verify_otp_desc', { mobile: signupData?.mobile })}</p>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        <form onSubmit={handleOtpSubmit(onOtpVerify)}>
          <input
            {...registerOtp('otp')}
            maxLength={6}
            placeholder="______"
            className="w-full text-center text-3xl tracking-[1em] font-mono bg-gray-100 border-2 border-gray-300 rounded-lg p-4 focus:ring-blue-500 focus:border-blue-500"
          />
          {otpErrors.otp && <p className="text-red-500 text-sm mt-2">{otpErrors.otp?.message}</p>}
          <button type="submit" disabled={isLoading} className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-green-400 flex items-center justify-center">
            {isLoading ? <LoaderCircle className="animate-spin w-5 h-5 mr-2" /> : null}
            {t('verify_proceed')}
          </button>
        </form>
        <button className="text-sm text-blue-600 mt-4 hover:underline">{t('resend_otp')}</button>
      </div>
    </motion.div>
  );

  const renderPermissionRequest = () => (
    <motion.div key="permissionRequest" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('permissions_title')}</h2>
        <p className="text-gray-600 mb-6">{t('permissions_desc')}</p>
        <div className="space-y-4 mb-8">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                <MapPin className="w-6 h-6 text-blue-600 mr-4"/>
                <div><div className="font-medium">{t('location_access')}</div><div className="text-sm text-gray-500">{t('location_access_desc')}</div></div>
                <input type="checkbox" checked={permissions.location} onChange={e => setPermissions(p => ({...p, location: e.target.checked}))} className="ml-auto h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"/>
            </label>
            <label className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                <MessageSquare className="w-6 h-6 text-green-600 mr-4"/>
                <div><div className="font-medium">{t('sms_alerts')}</div><div className="text-sm text-gray-500">{t('sms_alerts_desc')}</div></div>
                <input type="checkbox" checked={permissions.sms} onChange={e => setPermissions(p => ({...p, sms: e.target.checked}))} className="ml-auto h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"/>
            </label>
            <label className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                <Bell className="w-6 h-6 text-red-600 mr-4"/>
                <div><div className="font-medium">{t('push_notifications')}</div><div className="text-sm text-gray-500">{t('push_notifications_desc')}</div></div>
                <input type="checkbox" checked={permissions.notifications} onChange={e => setPermissions(p => ({...p, notifications: e.target.checked}))} className="ml-auto h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500"/>
            </label>
        </div>
        <button onClick={handlePermissionSubmit} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">{t('grant_create_id')}</button>
    </motion.div>
  );

  const renderQrCodeDisplay = () => (
    <motion.div key="qrCodeDisplay" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('qr_code_title')}</h2>
            <p className="text-gray-600 mb-6">{t('qr_code_desc')}</p>
            <div className="p-4 bg-gray-100 rounded-lg inline-block border">
                <img src={qrCodeDataUrl} alt="Your Relief QR Code" className="w-56 h-56" />
            </div>
            <div className="mt-6 space-y-4">
                <a href={qrCodeDataUrl} download={`FloodRelief_QR_${finalizingUser.id}.png`} className="w-full bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-800 flex items-center justify-center">
                    <Download className="w-5 h-5 mr-2" /> {t('download_qr')}
                </a>
                <button onClick={handleFinishSignup} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700">{t('finish_signup')}</button>
            </div>
        </div>
    </motion.div>
  );

  const renderCurrentView = () => {
    switch (view) {
      case 'userAuth':
        return renderUserAuth();
      case 'otpVerification':
        return renderOtpVerification();
      case 'permissionRequest':
        return renderPermissionRequest();
      case 'qrCodeDisplay':
        return renderQrCodeDisplay();
      case 'roleSelection':
      default:
        return renderRoleSelection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md overflow-hidden relative">
        <AnimatePresence mode="wait">
          {renderCurrentView()}
        </AnimatePresence>
        <div className="mt-6 text-center text-sm text-gray-500">
          {t('emergency_hotline')}: <span className="font-semibold text-red-600">1078</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
