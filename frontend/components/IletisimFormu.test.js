import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

beforeEach(() => {
    render(<IletisimFormu />);
  });
test('hata olmadan render ediliyor', () => {
    
});

test('iletişim formu headerı render ediliyor', () => {
    const header = screen.getByRole("heading", { level: 1 });
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent("İletişim Formu");

});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    const kullaniciAdi = screen.getByTestId("kullanici-adi");
    userEvent.type(kullaniciAdi, "testadi");
    const errMsgs = await screen.findAllByTestId("error");
    expect(errMsgs).toHaveLength(1);
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    const btnSubmit = screen.getByRole("button");
    userEvent.click(btnSubmit);
    await waitFor(() => {
      const errMsgs = screen.queryAllByTestId("error");
      expect(errMsgs).toHaveLength(3);
    });
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    const kullaniciAdi = screen.getByLabelText("Ad*");
  const kullaniciSoyad = screen.getByLabelText("Soyad*");
  const btnSubmit = screen.getByRole("button");

  userEvent.type(kullaniciAdi, "testadi");
  userEvent.type(kullaniciSoyad, "testsoyadi");
  userEvent.click(btnSubmit);

  const errMsgs = await screen.findAllByTestId("error");
  expect(errMsgs).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    const kullaniciEmail = screen.getByLabelText(/email*/i);
  userEvent.type(email, "asdd");
  await waitFor(() => {
    const errMsgs = screen.getByTestId("error");
    expect(errMsgs).toHaveTextContent(
      "email geçerli bir email adresi olmalıdır."
    );
  });
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    const btn = screen.getByRole("button");
  userEvent.click(btn);

  const errMsgs = await screen.findByText(/soyad gereklidir./i);
  expect(errMsgs).toBeInTheDocument();
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    const kullaniciAdi = screen.getByLabelText("Ad*");
    const kullaniciSoyad = screen.getByLabelText("Soyad*");
    const kullaniciEmail = screen.getByLabelText(/email*/i);
    const btnSubmit = screen.getByRole("button");
  
    userEvent.type(kullaniciAdi, "testadi");
    userEvent.type(kullaniciSoyad, "testsoyasi");
    userEvent.type(kullaniciEmail, "test@mail.com");
    userEvent.click(btnSubmit);
  
    await waitFor(() => {
      const nameInput = screen.getByTestId("firstnameDisplay");
      const surnameInput = screen.getByTestId("lastnameDisplay");
      const emailInput = screen.getByTestId("emailDisplay");
      const messageDisplay = screen.queryByTestId("messageDisplay");
      const errMsgs = screen.queryAllByTestId("error");
  
      expect(nameInput).toBeInTheDocument();
      expect(surnameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(messageDisplay).not.toBeInTheDocument();
      expect(errMsgs).toHaveLength(0);
    });
    });

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    const kullaniciAdi = screen.getByLabelText("Ad*");
    const kullaniciSoyad = screen.getByLabelText("Soyad*");
    const kullaniciEmail = screen.getByLabelText(/email*/i);
    const btnSubmit = screen.getByRole("button");
    const msg = screen.getByLabelText(/mesaj/i);
  
    userEvent.type(kullaniciAdi, "test");
    userEvent.type(kullaniciSoyad, "testsoyad");
    userEvent.type(kullaniciEmail, "test@mail.com");
    userEvent.type(msg, "mesaj");
    userEvent.click(btnSubmit);
  
    await waitFor(() => {
      const msgInput = screen.queryByTestId("messageDisplay");
      expect(msgInput).toBeInTheDocument();
      expect(msgInput.textContent).toMatch(/mesaj/i);
    });
});
