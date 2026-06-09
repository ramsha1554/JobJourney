import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Loader2, Briefcase, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await register(name, email, password);
        setIsSubmitting(false);
        if (res.success) navigate('/');
    };

    return (
        <div style={{
            minHeight:'100vh',display:'flex',flexDirection:'column',
            alignItems:'center',justifyContent:'center',
            background:'#f9fafb',padding:'24px',position:'relative',
        }}>
            <style>{`
                @keyframes spin{to{transform:rotate(360deg)}}
                .reg-input:focus{border-color:#0d9488 !important;box-shadow:0 0 0 3px rgba(13,148,136,.1)}
                .create-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(13,148,136,.3)}
                .create-btn:active{transform:none;box-shadow:none}
            `}</style>

            {/* Back button */}
            <button
                onClick={() => navigate('/landing')}
                style={{
                    position:'fixed',top:20,left:20,
                    display:'flex',alignItems:'center',gap:6,
                    fontSize:13,color:'#6b7280',fontWeight:500,
                    background:'white',border:'1px solid #e5e7eb',
                    padding:'7px 13px',borderRadius:8,cursor:'pointer',
                    transition:'all .15s ease',boxShadow:'0 1px 4px rgba(0,0,0,.06)',
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#0d9488';e.currentTarget.style.color='#0d9488'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.color='#6b7280'}}
            >
                <ArrowLeft size={13}/> Back
            </button>

            {/* Card */}
            <div style={{
                width:'100%',maxWidth:400,
                background:'white',borderRadius:20,
                border:'1px solid #e5e7eb',
                boxShadow:'0 8px 40px rgba(0,0,0,.08)',
                padding:'40px 36px',
            }}>
                {/* Logo */}
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:28}}>
                    <div style={{width:30,height:30,borderRadius:8,background:'#0d9488',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <Briefcase size={15} color="white"/>
                    </div>
                    <span style={{fontWeight:700,fontSize:16,color:'#0a2540',letterSpacing:'-.3px'}}>
                        Job<span style={{color:'#0d9488'}}>Journey</span>
                    </span>
                </div>

                {/* Heading */}
                <div style={{textAlign:'center',marginBottom:28}}>
                    <h1 style={{fontSize:24,fontWeight:800,color:'#0a2540',letterSpacing:'-.02em',marginBottom:6}}>
                        Create your account
                    </h1>
                    <p style={{fontSize:14,color:'#9ca3af'}}>Start tracking your job search for free</p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{marginBottom:18,padding:'11px 14px',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:10,fontSize:13,color:'#b91c1c'}}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>

                    {/* Full Name */}
                    <div>
                        <label style={{display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6}}>
                            Full name
                        </label>
                        <div style={{position:'relative'}}>
                            <User size={15} color="#9ca3af" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Your full name"
                                required
                                className="reg-input"
                                style={{
                                    width:'100%',paddingLeft:36,paddingRight:14,
                                    paddingTop:10,paddingBottom:10,
                                    border:'1.5px solid #e5e7eb',borderRadius:10,
                                    fontSize:14,color:'#0a2540',outline:'none',
                                    transition:'border-color .15s,box-shadow .15s',
                                    background:'#fafafa',boxSizing:'border-box',
                                }}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label style={{display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6}}>
                            Email address
                        </label>
                        <div style={{position:'relative'}}>
                            <Mail size={15} color="#9ca3af" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="reg-input"
                                style={{
                                    width:'100%',paddingLeft:36,paddingRight:14,
                                    paddingTop:10,paddingBottom:10,
                                    border:'1.5px solid #e5e7eb',borderRadius:10,
                                    fontSize:14,color:'#0a2540',outline:'none',
                                    transition:'border-color .15s,box-shadow .15s',
                                    background:'#fafafa',boxSizing:'border-box',
                                }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6}}>
                            Password
                        </label>
                        <div style={{position:'relative'}}>
                            <Lock size={15} color="#9ca3af" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="reg-input"
                                style={{
                                    width:'100%',paddingLeft:36,paddingRight:40,
                                    paddingTop:10,paddingBottom:10,
                                    border:'1.5px solid #e5e7eb',borderRadius:10,
                                    fontSize:14,color:'#0a2540',outline:'none',
                                    transition:'border-color .15s,box-shadow .15s',
                                    background:'#fafafa',boxSizing:'border-box',
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{position:'absolute',right:11,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',padding:2,color:'#9ca3af',lineHeight:0}}
                            >
                                {showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}
                            </button>
                        </div>
                        <p style={{fontSize:11,color:'#d1d5db',marginTop:5}}>Minimum 6 characters</p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="create-btn"
                        style={{
                            width:'100%',padding:'11px',borderRadius:10,
                            background: isSubmitting ? '#5eead4' : '#0d9488',
                            color:'white',border:'none',fontSize:14,fontWeight:600,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            display:'flex',alignItems:'center',justifyContent:'center',gap:6,
                            transition:'transform .15s,box-shadow .15s,background .15s',
                            marginTop:4,
                        }}
                    >
                        {isSubmitting ? (
                            <Loader2 size={16} style={{animation:'spin 1s linear infinite'}}/>
                        ) : (
                            <>Create Account <ArrowRight size={15}/></>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div style={{display:'flex',alignItems:'center',gap:12,margin:'20px 0'}}>
                    <div style={{flex:1,height:1,background:'#f3f4f6'}}/>
                    <span style={{fontSize:12,color:'#d1d5db',fontWeight:500}}>OR</span>
                    <div style={{flex:1,height:1,background:'#f3f4f6'}}/>
                </div>

                {/* Login link */}
                <p style={{textAlign:'center',fontSize:13,color:'#9ca3af',margin:0}}>
                    Already have an account?{' '}
                    <Link to="/login" style={{color:'#0d9488',fontWeight:600,textDecoration:'none'}}>
                        Sign in →
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;