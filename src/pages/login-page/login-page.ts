import { MyCoolComponent } from '../../utils/template/my-cool-component';
import { TVirtualDomNode } from '../../utils/template/my-cool-template-types';
import { MyCoolTemplate } from '../../utils/template/my-cool-template';
import { Form, IFormState } from '../../components/form/form';
import { IButtonProps } from '../../components/button/button';
import {
  PASSWORD_VALIDATION,
  saveAndTestValue,
} from '../../utils/const-variables/field-validation';
import { navigate } from '../../utils/util-functions/router';
import { ROUTES } from '../../utils/const-variables/pages';
import { IInputProps } from '../../components/input/input';
import {
  LOGIN_INPUT,
  PASSWORD_INPUT,
} from '../../utils/const-variables/field-inputs';

export class LoginPage extends MyCoolComponent<null, IFormState> {
  state: IFormState = { isValid: true };
  render(): TVirtualDomNode {
    const errorInputs = new Set<string>();
    const clearError = () => {
      if (!this.state.isValid) {
        this.setState(() => ({ isValid: true }));
      }
    };
    const login: IInputProps = {
      ...LOGIN_INPUT,
      value: '',
      onChange: (e: Event) => saveAndTestValue(e, login, errorInputs),
      clearError,
    };
    const password: IInputProps = {
      ...PASSWORD_INPUT,
      value: '',
      validation: PASSWORD_VALIDATION,
      onChange: (e: Event) => saveAndTestValue(e, password, errorInputs),
      clearError,
    };
    const inputs: Array<IInputProps> = [login, password];
    const buttons: Array<IButtonProps> = [
      { title: 'Enter', type: 'primary', htmlType: 'submit' },
      { title: 'Create account', type: 'secondary', htmlType: 'reset' },
    ];
    const onSubmit = (e: Event) => {
      e.preventDefault();
      if (errorInputs.size === 0) {
        // TODO: send request, check login and password
        navigate(ROUTES.chats.path);
        // TODO: set invalid state if login/password pair is not correct
        // this.setState(() => ({ isValid: false }));
      }
    };
    const onReset = () => navigate(ROUTES.register.path);

    return MyCoolTemplate.createComponent(Form, {
      key: 'login-page',
      title: 'Sign in',
      inputs,
      buttons,
      submit: onSubmit,
      reset: onReset,
      errorText: !this.state.isValid ? 'Invalid Login or Password' : '',
    });
  }
}