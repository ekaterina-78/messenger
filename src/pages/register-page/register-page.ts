import { PageForm } from '../../utils/base-components/page-form';
import { ROUTES } from '../../utils/const-variables/pages';
import {
  generateFormObject,
  validateRegisterFormInputs,
} from '../../utils/util-functions/form-inputs/form-inputs';
import { generateRegisterPageFormInputs } from '../../utils/util-functions/form-inputs/register-page-inputs';
import { IInputProps } from '../../components/input/input';
import { AuthService } from '../../services/api/auth-service';
import { Router } from '../../utils/router/router';

export class RegisterPage extends PageForm {
  auth = new AuthService();
  constructor() {
    super();
    this.title = 'Sign up';
    this.state.inputs = generateRegisterPageFormInputs(
      this.clearError.bind(this),
      this.updateInput.bind(this)
    );
    this.buttons = [
      { title: 'Sign up', type: 'primary', htmlType: 'submit' },
      { title: 'Sign in', type: 'secondary', htmlType: 'reset' },
    ];
    this.submitForm = this.submitForm.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  async submitForm(e: Event) {
    e.preventDefault();
    const formState = validateRegisterFormInputs(
      <Array<IInputProps>>this.state.inputs
    );
    if (formState.isValid) {
      const requestBody = generateFormObject(
        <Array<IInputProps>>this.state.inputs
      );
      console.log('Register', requestBody);
      try {
        const response = await this.auth.signUp(requestBody);
        console.log('Register response', response);
        Router.getInstance().go(ROUTES.chats.path);
      } catch (err) {
        this.setState(s => ({
          ...s,
          isValid: false,
          errorText: JSON.parse(err.data).reason,
        }));
      }
    } else {
      if (this.state.errorText !== formState.errorText) {
        this.setState(s => ({
          ...s,
          isValid: formState.isValid,
          errorText: formState.errorText,
        }));
      }
    }
  }

  resetForm() {
    Router.getInstance().go(ROUTES.login.path);
  }
}
