/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { toRadian } from '@base/math';
import { B2 } from '../instantiated';
import { IWheelJoint } from '../../spec/i-physics-joint';
import { WheelJoint2D } from '../../framework';
import { B2Joint } from './joint-2d';
import { PHYSICS_2D_PTM_RATIO } from '../../framework/physics-types';

export class B2WheelJoint extends B2Joint implements IWheelJoint {
    setFrequency (v: number): void {
        this.updateStiffnessAndDamping();
    }
    setDampingRatio (v: number): void {
        this.updateStiffnessAndDamping();
    }
    updateStiffnessAndDamping (): void {
        if (this._b2joint) {
            B2.SetLinearFrequencyAndDampingRatio(
                this._b2joint,
                (this._jointComp as WheelJoint2D).frequency,
                (this._jointComp as WheelJoint2D).dampingRatio,
            );
        }
    }

    // motor
    enableMotor (v: boolean): void {
        if (this._b2joint) {
            (this._b2joint as B2.WheelJoint).EnableMotor(v);
        }
    }
    setMaxMotorTorque (v: number): void {
        if (this._b2joint) {
            (this._b2joint as B2.WheelJoint).SetMaxMotorTorque(v);
        }
    }
    setMotorSpeed (v: number): void {
        if (this._b2joint) {
            (this._b2joint as B2.WheelJoint).SetMotorSpeed(v);
        }
    }

    _createJointDef (): any {
        const comp = this._jointComp as WheelJoint2D;
        const def = new B2.WheelJointDef();
        def.localAnchorA = { x: comp.anchor.x / PHYSICS_2D_PTM_RATIO, y: comp.anchor.y / PHYSICS_2D_PTM_RATIO };
        def.localAnchorB = { x: comp.connectedAnchor.x / PHYSICS_2D_PTM_RATIO, y: comp.connectedAnchor.y / PHYSICS_2D_PTM_RATIO };
        const angle = toRadian(comp.angle);
        def.localAxisA = { x: Math.cos(angle), y: Math.sin(angle) };
        def.maxMotorTorque = comp.maxMotorTorque;
        def.motorSpeed = toRadian(comp.motorSpeed);
        def.enableMotor = comp.enableMotor;
        def.damping = 0;//comp.dampingRatio;
        def.stiffness = 1;//comp.frequency;
        return def;
    }
}
