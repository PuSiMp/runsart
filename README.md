# RunsArt: ศูนย์รวมเครื่องมือวิเคราะห์การวิ่ง (Vercel + Supabase + Strava)

## โครงสร้างโฟลเดอร์ (อัปโหลดทั้งโฟลเดอร์ขึ้น Vercel)

    index.html                 หน้าแรก (ศูนย์รวมเครื่องมือ)
    tools/slope/index.html     เครื่องมือ: ความชันและความยากเส้นทาง
    config.js                  ค่า Supabase (ใส่ครั้งเดียว ใช้ทุกหน้า)
    supabase.sql               สร้างตารางฐานข้อมูล
    api/                       ฟังก์ชันฝั่งเซิร์ฟเวอร์สำหรับ Strava
    package.json

เปิดเว็บที่ `/` จะเป็นหน้าแรก กดการ์ดเพื่อเข้า `/tools/slope/`
การล็อกอินใช้ร่วมกัน ล็อกอินที่หน้าไหนก็ได้ ทุกหน้าจะรู้จัก

## ตั้งค่า (ทำครั้งเดียว)

### Supabase
1. สร้างโปรเจกต์ แล้วรัน `supabase.sql` ใน SQL Editor
2. Project Settings > API คัดลอก Project URL กับ anon public key ใส่ใน `config.js`
3. Authentication > URL Configuration
   - Site URL: `https://runsart.vercel.app`
   - Redirect URLs เพิ่ม `https://runsart.vercel.app/**` (ต้องมี `/**` เพราะตอนนี้มีหลายหน้า)
4. Authentication > Sign In / Providers > Email ปิด Confirm email ถ้าอยากให้สมัครแล้วเข้าได้ทันที

### Strava
1. strava.com/settings/api สร้างแอป ช่อง Authorization Callback Domain ใส่ `runsart.vercel.app`
2. คัดลอก Client ID และ Client Secret

### Vercel > Settings > Environment Variables
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STATE_SECRET`
(`SUPABASE_SERVICE_ROLE_KEY` เป็นความลับ ห้ามใส่ใน config.js) แล้ว Redeploy

ถ้า Strava อนุญาตแล้วแต่บันทึก token ไม่สำเร็จ ให้ตรวจว่า Vercel มี `SUPABASE_URL` และ `SUPABASE_SERVICE_ROLE_KEY` (service role key ไม่ใช่ anon key) และรัน `supabase.sql` ในโปรเจกต์เดียวกันเพื่อสร้างตาราง `public.strava_tokens` แล้ว Redeploy หลังแก้ Environment Variables

## วิธีเพิ่มเครื่องมือใหม่ (ทีละตัว)
1. สร้างโฟลเดอร์ `tools/ชื่อเครื่องมือ/` ใส่ `index.html` ของเครื่องมือนั้น
   - ใส่ `<script src="/config.js"></script>` ถ้าต้องใช้บัญชี
   - ใส่ลิงก์ `<a href="/">← หน้าแรก</a>` ไว้กลับหน้าแรก
2. ที่ `index.html` หน้าแรก คัดลอกการ์ด `<a class="card" ...>` อันเดิมไปวางต่อในกลุ่มเดียวกัน แล้วแก้ชื่อ คำอธิบาย ลิงก์ และคำค้น (`data-kw`) การ์ด "เครื่องมือถัดไปกำลังมา" เก็บไว้ท้ายสุดหรือลบออกเมื่อครบก็ได้
3. ถ้าเครื่องมือนั้นต้องใช้ Strava แล้วให้เด้งกลับหน้าตัวเอง เพิ่มพาธ เช่น `/tools/pace/` ในรายการ `BACK` ที่ไฟล์ `api/_lib.js`

## ส่งของจากหน้าแรกไปเครื่องมือ
- ไฟล์ที่ลากมาวาง: เก็บชั่วคราวใน sessionStorage แล้วเครื่องมือเปิดอ่านให้เอง
- กิจกรรม Strava: `/tools/slope/?activity=ID`
- เส้นทางที่บันทึก: `/tools/slope/?route=ID`

## หมายเหตุ
- รองรับไฟล์ .gpx และ .tcx (.fit ยังไม่รองรับ)
- Garmin, Coros, Suunto, Apple Watch ซิงก์เข้า Strava แล้วดึงต่อได้ ไม่มี API ตรงสำหรับผู้ใช้ทั่วไป
- แอป Strava ใหม่เชื่อมได้คนเดียวก่อน ปลดล็อกได้ถึง 10 คนที่หน้า API Settings เกินนั้นต้องส่งตรวจกับ Strava
